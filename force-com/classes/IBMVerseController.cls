public with sharing class IBMVerseController {
    
    @AuraEnabled
    public static List<Account> findByName(String searchKey) {
        String name = '%' + searchKey + '%';
        return [SELECT id, name FROM Account WHERE name LIKE :name LIMIT 8];
    }    
    
    
    @AuraEnabled    
    public static Boolean createMailForVerse(String jsonObject, String accountId) {
        
        Boolean success = false;
        
        IBMVerseMail verseMail = convertJsonToIBMVerseMail(jsonObject);
        
        if (verseMail!=null) {
            EmailMessage message = new EmailMessage();
            message.FromAddress = verseMail.sender.emailAddress;
            message.FromName = verseMail.sender.displayName;
            
            if (verseMail.recipientTo != null) {
                
                String[] recipients = new String[]{};
                    
                    for (IBMVerseMailAdressData addressData : verseMail.recipientTo) {
                        recipients.add(addressData.emailAddress);
                    }
                
                message.ToAddress = String.join(recipients, ',');    
            }
            
            if (verseMail.recipientCc != null) {
                
                String[] recipientsCc = new String[]{};
                    
                    for (IBMVerseMailAdressData addressData : verseMail.recipientCc) {
                        recipientsCc.add(addressData.emailAddress);
                    }
                
                message.CcAddress = String.join(recipientsCc, ',');            
            }
            
            message.MessageDate = verseMail.timeSent;
            message.Status = '3';
            message.HtmlBody = verseMail.body;
            message.Incoming = true;
            message.Subject = verseMail.subject;
            message.RelatedToId = accountId;
            insert message;
            
            success = true;
        }
        
        return success;
    }
    
    
    @AuraEnabled
    public static IBMVerseMail convertJsonToIBMVerseMail(String jsonContent) {
        
        try {
            IBMVerseMail verseMail;
            
            JSONParser parser = JSON.createParser(jsonContent);
            while (parser.nextToken()!=null) {
                if (parser.getCurrentToken()==JSONToken.FIELD_NAME) {
                    String currentProperty = parser.getText();
                    if (currentProperty=='verseApiData') {
                        parser.nextToken();
                        while(parser.nextToken() != null) {
                            if(parser.getCurrentToken() == JSONToken.START_OBJECT) {
                                verseMail = (IBMVerseMail)parser.readValueAs(IBMVerseMail.class);
                            }
                        }
                    }
                }
            }      
            return verseMail;
        } catch(Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        }
    }
    
}