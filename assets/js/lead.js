/* Beyond Tatva · send a lead to the "Beyond Tatva Leads" Google Form
   (responses go to the linked Google Sheet + email notification).
   BTLead({ company, lastName, mobile, city, source, description }) → Promise.
   Google does not report success to other sites, so this resolves once the
   request is sent and rejects only on a network failure. */
(function () {
  'use strict';
  var URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfKks7WxjFYGO-I_sYXPG1PxqbP4sZ0qnCzURYdTyxupsHH9Q/formResponse';
  var F = { type: 'entry.361000904', name: 'entry.2049554881', phone: 'entry.1980938376', school: 'entry.1657247066', town: 'entry.1438620346', details: 'entry.286037829' };
  window.BTLead = function (d) {
    var p = new URLSearchParams();
    p.append(F.type, d.source === 'Chat' ? 'Parent / Student' : 'School');
    p.append(F.name, d.lastName || '');
    p.append(F.phone, d.mobile || '');
    p.append(F.school, d.company || '');
    p.append(F.town, d.city || '');
    p.append(F.details, d.description || '');
    return fetch(URL, { method: 'POST', mode: 'no-cors', body: p });
  };
})();
