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
  var ID = '1464082000000480559';
  var ANAL = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=9b4d6b7ced374e15d6120d648aab1c95eb9e808c7fb5407032017800d31170ef88e353d9feee2d7cbe5e904b73314747gidb9758dd20418fb9661a5789173979322d45250e6ec7bee180c84ccfaa25e16b7gid00546e0430f4e216ce6076f12290be83e6b9311052589a35c2d1f7f45ab73e77gid0b5273a458e570d27ae848be7228a28b4b35690adf94f4a7e6ae6050d157ee7e&tw=7bbb0597b7e68a32ad0611306d9b02a128107e8b5a030a342ad4749115d67ce6&version=v2';
  // Zoho's own hidden form + analytics script, exactly as the embed code sets them up.
  var form = document.createElement('form');
  form.id = 'webform' + ID; form.name = 'WebToLeads' + ID; form.hidden = true; form.setAttribute('aria-hidden', 'true');
  var FIELDS = ['xnQsjsdp', 'zc_gad', 'xmIwtLD', 'actionType', 'returnURL', 'Company', 'Last Name', 'Mobile', 'Address - City', 'Lead Source', 'Description', 'aG9uZXlwb3Q'];
  FIELDS.forEach(function (n) { var i = document.createElement(n === 'Description' ? 'textarea' : 'input'); i.name = n; if (n === 'zc_gad') i.id = 'zc_gad'; form.appendChild(i); });
  function mount() {
    if (!document.body.contains(form)) document.body.appendChild(form);
    if (typeof window._wfa_fstprtcken == 'undefined') window._wfa_fstprtcken = {};
    window._wfa_fstprtcken[ID] = true;
    var sc = document.createElement('script'); sc.id = 'wf_anal'; sc.src = ANAL; form.appendChild(sc);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  function set(n, v) { form.elements[n].value = v; }
  window.BTLead = function (d) {
    if (!document.body.contains(form)) mount();
    set('xnQsjsdp', Z.xnQsjsdp); set('xmIwtLD', Z.xmIwtLD); set('actionType', Z.actionType); set('returnURL', 'null'); set('aG9uZXlwb3Q', '');
    set('Company', String(d.company || 'Not given').slice(0, 200));
    set('Last Name', String(d.lastName || 'Website lead').slice(0, 80));
    set('Mobile', String(d.mobile || '').slice(0, 30));
    set('Address - City', String(d.city || '').slice(0, 255));
    set('Lead Source', SOURCES.indexOf(d.source) > -1 ? d.source : '-None-');
    set('Description', String(d.description || ''));
    var ev = { target: form, currentTarget: form, type: 'submit', preventDefault: function () {} };
    try { if (window._wfa_track && _wfa_track.wfa_submit) _wfa_track.wfa_submit(ev); } catch (e) {}
    var f = new FormData(form);
    return fetch(Z.url, { method: 'POST', body: f, cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('Zoho ' + res.status);
      var ct = res.headers.get('Content-Type') || '';
      return ct.indexOf('application/json') > -1 ? res.json() : res.text();
    }).then(function (data) {
      if (data && typeof data === 'object' && (data.actionsubmit === 'error_msg' || data.actionsubmit === 'captcha_error' || data.invalidCaptcha === 'true')) throw new Error(data.message || data.actionvalue || 'Zoho rejected the lead');
      try { if (window._wfa_track && _wfa_track.wfa_post_submit) _wfa_track.wfa_post_submit(ev); } catch (e) {}
      if (data && typeof data === 'object' && data.actionsubmit && data.actionsubmit !== 'Splash Message' && !data.success) console.warn('[Beyond Tatva] Zoho reply:', data);
      return data;
    });
  };
})();
