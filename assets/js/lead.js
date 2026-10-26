/* Beyond Tatva · send a lead into Zoho CRM (Leads module, via its webform).
   BTLead({ company, lastName, mobile, city, source, description }) → Promise
   resolves when Zoho accepts the lead, rejects otherwise. */
(function () {
  'use strict';
  var Z = {
    url: 'https://crm.zoho.in/crm/WebToLeadForm',
    xnQsjsdp: 'b94717063d67849f242882aa8a3741c0cab73cc19c8eff72562483cad583f847',
    xmIwtLD: '45e7559a36d10b81b6f64b465fcf6b35eda8ee63b3526fbd8b500e88c2ccb052becca4d0db28b5c184a59a77916ccaf5',
    actionType: 'TGVhZHM='
  };
  var SOURCES = ['Advertisement', 'Cold Call', 'Employee Referral', 'External Referral', 'Online Store', 'Partner', 'Public Relations', 'Sales Email Alias', 'Seminar Partner', 'Internal Seminar', 'Trade Show', 'Web Download', 'Web Research', 'Chat', 'X (Twitter)', 'Facebook'];
  window.BTLead = function (d) {
    var f = new FormData();
    f.append('xnQsjsdp', Z.xnQsjsdp); f.append('zc_gad', ''); f.append('xmIwtLD', Z.xmIwtLD);
    f.append('actionType', Z.actionType); f.append('returnURL', 'null'); f.append('aG9uZXlwb3Q', '');
    f.append('Company', String(d.company || 'Not given').slice(0, 200));
    f.append('Last Name', String(d.lastName || 'Website lead').slice(0, 80));
    f.append('Mobile', String(d.mobile || '').slice(0, 30));
    f.append('Address - City', String(d.city || '').slice(0, 255));
    f.append('Lead Source', SOURCES.indexOf(d.source) > -1 ? d.source : '-None-');
    f.append('Description', String(d.description || ''));
    return fetch(Z.url, { method: 'POST', body: f, cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('Zoho ' + res.status);
      var ct = res.headers.get('Content-Type') || '';
      return ct.indexOf('application/json') > -1 ? res.json() : res.text();
    }).then(function (data) {
      if (data && typeof data === 'object' && (data.actionsubmit === 'error_msg' || data.actionsubmit === 'captcha_error' || data.invalidCaptcha === 'true')) throw new Error(data.message || data.actionvalue || 'Zoho rejected the lead');
      return data;
    });
  };
})();
