global class IBMVerseMail {

    @AuraEnabled
    public List<IBMVerseMailAdressData> recipientCc {get; set;}
    @AuraEnabled
    public List<IBMVerseMailAdressData> recipientTo {get; set;}
    @AuraEnabled
    public IBMVerseMailAdressData sender {get; set;}
    @AuraEnabled
    public String subject {get; set;}
    @AuraEnabled
    public DateTime timeSent {get; set;}
    @AuraEnabled
    public String body {get; set;}
    @AuraEnabled
    public String contextId {get; set;}
    @AuraEnabled
    public String id {get; set;}
    
}