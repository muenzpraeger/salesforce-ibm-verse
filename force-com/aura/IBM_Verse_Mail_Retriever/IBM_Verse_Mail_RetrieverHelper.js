({
    searchKeyChange: function (cmp, event) {
        var action = cmp.get('c.findByName');
        var input = cmp.find('inputSearch');
        if (input.get('v.value')!=('') && !input.get('v.validity').tooShort) {
            action.setParams({ "searchKey": input.get('v.value') });
            action.setCallback(this, function(a) {
                cmp.set('v.accounts', a.getReturnValue());
                var form = cmp.find('lookupForm');
				$A.util.addClass(form, 'slds-is-open');
            });
            $A.enqueueAction(action);   
        } else {
	        this.resetInputs(cmp);
        }
    },
    accountSelected : function(cmp, event) {
        var accounts = cmp.get('v.accounts');
        var account = cmp.get('v.accountSelected');
        var input = cmp.find('inputSearch');
        input.set('v.value', accounts[event.target.id].Name);
        cmp.set('v.accountSelected', accounts[event.target.id]);
        this.enableInputs(cmp);
    },
    logMail : function(cmp, event) {
        var action = cmp.get('c.createMailForVerse');
        var jsonObject = cmp.get('v.verseObject');
        var account = cmp.get('v.accountSelected');
        console.log(account.Id);
        action.setParams({ 'jsonObject': JSON.stringify(jsonObject), 'accountId': account.Id });
        action.setCallback(this, function(a) {
            window.self.close();
            alert('Message has been logged');
        });
        $A.enqueueAction(action);
    },
    resetInputs: function(cmp) {
        var button = cmp.find('btnLog');
        button.set('v.disabled', true);
        cmp.set('v.accounts', null);
        var form = cmp.find('lookupForm');
		$A.util.removeClass(form, 'slds-is-open');
    },
    enableInputs: function(cmp) {
        var button = cmp.find('btnLog');
        button.set('v.disabled', false);     
        cmp.set('v.accounts', null);
        var form = cmp.find('lookupForm');
		$A.util.removeClass(form, 'slds-is-open');
    }
})