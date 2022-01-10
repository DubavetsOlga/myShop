/**
 * Created by odubavets on 04.01.2022.
 */

public with sharing class ShopController {

    @AuraEnabled (cacheable=true)
    public static List<Category__c> getCategory() {
        return [
                SELECT Name, Category__c, CountCommodity__c
                FROM Category__c
                WHERE CountCommodity__c != 0
                ORDER BY Category__c, Name
        ];
    }

    @AuraEnabled (cacheable=true)
    public static List<Commodity__c> getCommodities(Id categoryId) {
        String query = 'SELECT Id, Name, Image__c, Price__c, Description__c, Account__r.Name, CountComment__c,\n' +
                            'Count__c, Rating__c, Account__c, Active__c, Approved__c\n' +
                        'FROM Commodity__c\n' +
                        'WHERE Active__c = true AND Approved__c = true';
        if (categoryId != null) query += ' AND Category__c = \'' + categoryId + '\'';
        query += ' ORDER BY Name';
        if (categoryId == null) query += ' LIMIT 50';
        return Database.query(query);
    }

    @AuraEnabled (cacheable=true)
    public static List<Advertising__c> getAdvertising() {
        return [
                SELECT Id, Image__c, Name
                FROM Advertising__c
        ];
    }

    @AuraEnabled (cacheable=true)
    public static List<Basket__c> getBasket() {
        return [
                SELECT Id, Commodity__r.Name, Count__c, Commodity__r.Price__c, Commodity__r.Image__c,
                        Commodity__r.Count__c, Commodity__r.Active__c, Commodity__r.Approved__c
                FROM Basket__c
        ];
    }

    @AuraEnabled (cacheable=true)
    public static List<Comment__c> getComments(Id commodityId) {
        return [
                SELECT Description__c, Mark__c
                FROM Comment__c
                WHERE Commodity__c = :commodityId
        ];
    }

    @AuraEnabled (cacheable=true)
    public static List<Commodity__c> getCommoditiesByAccount(Id accountId) {
        return [
                SELECT Id, Name, Image__c, Price__c, Description__c, Account__r.Name, CountComment__c, Count__c, Rating__c, Account__c
                FROM Commodity__c
                WHERE Active__c = true AND Approved__c = true AND Account__c = :accountId
                ORDER BY Name
        ];
    }

    @AuraEnabled
    public static void clearBasket(List<Basket__c> basketItems) {
        delete basketItems;
    }

    private static List<Commodity__c> updateCommodities(List<Basket__c> basketItems) {
        Boolean updateParam = true;
        List<Commodity__c> commodities = new List<Commodity__c>();
        List<ID> commodityIds = new List<ID>();
        for (Basket__c basketItem : basketItems) {
            commodityIds.add(basketItem.Commodity__c);
        }
        List<Commodity__c> aCommodities = [
                SELECT Count__c, Approved__c, Active__c
                FROM Commodity__c
                WHERE Id IN :commodityIds
                FOR UPDATE
        ];
        for (Basket__c basketItem : basketItems) {
            if (updateParam == false) break;
            for (Commodity__c aCommodity : aCommodities) {
                if (basketItem.Commodity__c == aCommodity.Id) {
                    if (aCommodity.Count__c >= basketItem.Count__c
                            && aCommodity.Approved__c == true
                            && aCommodity.Active__c == true) {
                        aCommodity.Count__c -= basketItem.Count__c;
                        commodities.add(aCommodity);
                    } else {
                        updateParam = false;
                        Approval.unlock(commodities, false);
                    }
                    break;
                }
            }
        }
        return updateParam ? commodities : null;
    }

    @AuraEnabled
    public static void orderBasket(List<Basket__c> basketItems, Object info) {
        List<Commodity__c> commodities = updateCommodities(basketItems);
        if (commodities != null) {
            Delivery__c aDelivery = new Delivery__c(Status__c = 'Created');
            insert aDelivery;
            List<DeliveryItem__c> deliveryItems = new List<DeliveryItem__c>();
            for (Basket__c aBasketItem : basketItems) {
                deliveryItems.add(new DeliveryItem__c(
                        Commodity__c = aBasketItem.Commodity__c,
                        Price__c = aBasketItem.Commodity__r.Price__c * aBasketItem.Count__c,
                        Count__c = aBasketItem.Count__c,
                        Delivery__c = aDelivery.Id
                ));
            }
            insert deliveryItems;
            update commodities;
            clearBasket(basketItems);
        }
    }

    @AuraEnabled
    public static void addToBasket(Id commodityId) {
        Basket__c aBasket = new Basket__c(Commodity__c = commodityId, Count__c = 1);
        insert aBasket;
    }

    @AuraEnabled (cacheable=true)
    public static Boolean checkInBasket(Id commodityId) {
        return [SELECT COUNT() FROM Basket__c WHERE Commodity__c = :commodityId] == 0 ? false : true;
    }

    @AuraEnabled
    public static Comment__c addComment(Id commodityId, String comment, Integer mark) {
        Comment__c aComment = new Comment__c(Commodity__c = commodityId, Description__c = comment, Mark__c = mark);
        insert aComment;
        return aComment;
    }

    @AuraEnabled
    public static void deleteFromBasket(Basket__c basketItem) {
        delete basketItem;
    }

    @AuraEnabled (cacheable=true)
    public static Boolean checkCommentByAccountAndCommodity(Id commodityId) {
        return [SELECT COUNT() FROM Comment__c WHERE Commodity__c = :commodityId] == 0 ? true : false;
    }

    @AuraEnabled (cacheable=true)
    public static List<Delivery__c> getOrders() {
        return [
                SELECT Id, Status__c, FORMAT(CreatedDate) formattedDate, Price__c, (select Commodity__r.Name, Count__c, Price__c, Id from Delivery_Items__r)
                FROM Delivery__c
                ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled (cacheable=true)
    public static Boolean getFavoriteByCommodity(Id commodityId) {
        return [SELECT COUNT() FROM Favorite__c WHERE Commodity__c = :commodityId] == 0 ? true : false;
    }

    @AuraEnabled
    public static void changeFavorite(Id commodityId) {
        List<Favorite__c> favorites = [SELECT Id FROM Favorite__c WHERE Commodity__c = :commodityId];
        if (favorites.isEmpty()) {
            Favorite__c aFavorite = new Favorite__c(Commodity__c = commodityId);
            insert aFavorite;
        } else {
            delete favorites;
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<Commodity__c> getFavorite() {
        return [
                SELECT Id, Name, Image__c, Price__c, Description__c, Account__r.Name, CountComment__c, Count__c, Rating__c, Account__c, Active__c, Approved__c
                FROM Commodity__c
                WHERE Id IN (SELECT Commodity__c FROM Favorite__c)
                ORDER BY Name
        ];
    }

    @AuraEnabled (cacheable=true)
    public static List<Commodity__c> getByFilter(Decimal minPrice, Decimal maxPrice, String inStock, Integer rating, Id categoryId) {
        String query = 'SELECT Id, Name, Image__c, Price__c, Description__c, Account__r.Name, CountComment__c, Count__c, ' +
                            'Rating__c, Account__c, Active__c, Approved__c\n' +
                        'FROM Commodity__c\n' +
                        'WHERE Active__c = true and Approved__c = true\n' +
                            'AND Price__c >= ' + minPrice +
                            'AND Price__c <= ' + maxPrice +
                            'AND Rating__c >= ' + rating;
        if (inStock == 'InStock') {
            query += ' AND Count__c > 0';
        }
        if (categoryId != null) {
            query += ' AND Category__c = \'' + categoryId + '\'';
        }
        query += ' ORDER BY Name';
        return Database.query(query);
    }

    @AuraEnabled (cacheable=true)
    public static Decimal getMaxPrice() {
        return (Decimal) [SELECT MAX(Price__c) FROM Commodity__c][0].get('expr0');
    }

}