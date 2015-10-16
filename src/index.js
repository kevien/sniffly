// Timing in milliseconds above which a network request probably occurred.
// TODO: Determine this dynamically from the distribution of response times.
var TIMING_UPPER_THRESHOLD = 3;
// Timing in milliseconds below which a request is probably a fluke.
var TIMING_LOWER_THRESHOLD = -10;
// Use an arbitrary static preloaded HSTS host for timing calibration
var BENCHMARK_HOST = 'http://torproject.org/';
// Initial timing calibration offset. This gets recalculated every other fetch.
var OFFSET = 0;

var visitedElem = document.getElementById('visited');
var notVisitedElem = document.getElementById('not_visited');

// Edit this based on scraper results.
var hosts =
['http://www.npmjs.com/',
'http://www.xoom.com/',
'http://atom.io/',
'http://angel.co/',
'http://vine.co/',
'http://www.oculus.com/en-us/',
'http://www.hackerrank.com/',
'http://noscript.net/',
'http://www.sixt.com/',
'http://www.crazydomains.com.au/',
'http://www.yola.com/',
'http://www.mailerlite.com/',
'http://giustizia.it/',
'http://notepad-plus-plus.org/',
'http://www.unfranchise.com.tw',
'http://www.ing-diba.de/',
'http://www.adreactor.com/',
'http://meduza.io/',
'http://www.wealthfront.com/',
'http://mail.live.com/default.aspx',
'http://muabannhanh.com/',
'http://upjers.com/',
'http://www.rabobank.nl/',
'http://www.ing.nl/',
'http://www.kickstarter.com/',
'http://creativemarket.com/',
'http://pinterest.com/',
'http://www.ashampoo.com/en/usd',
'http://www.sofort.com/',
'http://www.xing.com/',
'http://podio.com/',
'http://www.servis24.cz/',
'http://www.galeria-kaufhof.de/',
'http://www.kocpc.com.tw/',
'http://www.commbank.com.au/',
'http://recyclix.com/',
'http://www.usajobs.gov/',
'http://briian.com/',
'http://www.vultr.com/',
'http://about.gitlab.com/',
'http://www.tanga.com',
'http://wanelo.com/',
'http://herokuapp.com/',
'http://unsplash.com/',
'http://ria.com/',
'http://www.missguided.co.uk/',
'http://lever.co/',
'http://venmo.com/',
'http://ello.co/',
'http://www.template.net/',
'http://www.digid.nl/',
'http://qiwi.ru/',
'http://www.instacart.com/',
'http://www.touchofmodern.com/',
'http://roadtrippers.com/',
'http://www.freshdesignweb.com/',
'http://www.fnb.co.za',
'http://www.graphicsprings.com/',
'http://www.patreon.com/',
'http://hotwords.com/',
'http://www.cryptsy.com/',
'http://vitalsource.com/',
'http://pass.yandex.ua/?retpath=http%3A%2F%2Fwww.yandex.ua%2F',
'http://www.cloudflare.com/',
'http://www.yammer.com/',
'http://ixquick.com/',
'http://sbis.ru/',
'http://www.ecosia.org/',
'http://www.freecycle.org/',
'http://pass.yandex.by/?retpath=http%3A%2F%2Fwww.yandex.by%2F',
'http://www.mailjet.com/',
'http://www.yugster.com/',
'http://tinypng.com/',
'http://nest.com/',
'http://kat.cr/',
'http://www.practo.com/',
'http://c9.io/',
'http://beget.ru/',
'http://startpage.com/',
'http://www.bet-at-home.com/',
'http://tripcase.com/',
'http://www.douglas.de/',
'http://yande.re/post',
'http://www.bookbub.com/',
'http://www.swarmapp.com/',
'http://www.woorank.com/',
'http://paytm.com/',
'http://www.payza.com/',
'http://www.instapaper.com/',
'http://wikitech.wikimedia.org/',
'http://www.ipko.pl/',
'http://www.straighttalk.com/wps/portal/home',
'http://heroku.com/',
'http://www.waze.com/',
'http://www.privat24.ua',
'http://zimbra.free.fr/',
'http://www.blueapron.com/',
'http://secure.logmein.com/',
'http://adblockplus.org/',
'http://www.udemy.com/',
'http://tribalwars2.com/',
'http://sparkfun.com/',
'http://www.sparebank1.no/bank/',
'http://spotify.com/',
'http://creditkarma.com/',
'http://www.paxum.com/payment/phrame.php?action=displayIndex',
'http://jamberrynails.net/',
'http://fotolia.com/',
'http://stacksocial.com/',
'http://www.cms.gov/',
'http://iconfinder.com/',
'http://www.expireddomains.net/',
'http://navalny.com/',
'http://privatbank.ua/',
'http://www.englishforums.com/',
'http://www.hushmail.com/',
'http://www.pingdom.com/',
'http://www.zomato.com/',
'http://icook.tw/',
'http://www.office.com/',
'http://groupme.com/',
'http://wikimedia.org/',
'http://dapulse.com/',
'http://www.cuelinks.com/',
'http://www.attracta.com/',
'http://www.outlook.com/owa/',
'http://www.dnb.no/',
'http://www.lotterypost.com/',
'http://bitcoin.org/',
'http://href.li/',
'http://skandiabanken.no/',
'http://foursquare.com/',
'http://www.usa.gov/',
'http://www.bitgold.com/',
'http://quizlet.com/',
'http://www.alipay.com',
'http://yadi.sk/',
'http://duckduckgo.com/',
'http://www.dashlane.com/',
'http://www.ozbargain.com.au/',
'http://www.ricardo.ch/',
'http://www.fakku.net/',
'http://www.mturk.com/',
'http://www.national-lottery.co.uk/',
'http://www.onthebeach.co.uk/',
'http://www.icloud.com/',
'http://code.org/',
'http://www.chapters.indigo.ca/',
'http://www.dntx.com/',
'http://www.slsp.sk/',
'http://www.raise.com/',
'http://cinematrix.net/',
'http://www.baifubao.com/',
'http://blogun.ru/',
'http://videostripe.com/',
'http://typekit.com/',
'http://www.splitwise.com/',
'http://www.eobot.com',
'http://login.microsoftonline.com/',
'http://www.xero.com/',
'http://www.rakuten-sec.co.jp/',
'http://www.creativecow.net/',
'http://sweb.ru/',
'http://www.seroundtable.com/',
'http://www.hipchat.com/',
'http://subscribe.free.fr/',
'http://topvisor.ru/',
'http://www.avforums.com/',
'http://www.travelodge.co.uk',
'http://opendns.com/',
'http://www.pcloud.com/',
'http://www.akiba-online.com/',
'http://www.instamojo.com/',
'http://www.commsec.com.au/',
'http://assembla.com/',
'http://www.bukalapak.com/',
'http://www.docusign.net/',
'http://www.hotslogs.com/',
'http://www.consorsbank.de/home',
'http://www.searchlock.com/',
'http://madmimi.com/',
'http://www.bawagpsk.com/BAWAGPSK/PK',
'http://www.crunchbase.com/',
'http://www.maketecheasier.com/',
'http://session.wikispaces.com/1/auth/auth?authToken=4753096aabc3a25fd80467fb292f1873',
'http://witkit.com/',
'http://pixabay.com/',
'http://www.mygreatlakes.org/',
'http://ncore.cc/',
'http://www.hpconnected.com/',
'http://payeer.com/',
'http://join.me/',
'http://www.gamefly.com/',
'http://bitcoinwisdom.com/',
'http://land.nrw/',
'http://www.saddahaq.com/',
'http://www.quantcast.com/',
'http://www.behance.net/',
'http://xapo.com/',
'http://fabric.io/',
'http://www.dollarphotoclub.com/',
'http://mandrillapp.com/',
'http://moodle.org/',
'http://imp.free.fr/',
'http://www.pebble.com/',
'http://www.periscope.tv/',
'http://generalassemb.ly/',
'http://login.szn.cz/?returnURL=http%3a%2f%2femail.seznam.cz%2f&serviceId=email',
'http://www.lyft.com/',
'http://www.mql5.com/',
'http://www.wrike.com/',
'http://www.fanfiction.net',
'http://www.box.com/',
'http://www.test.de/',
'http://calendar.sunrise.am',
'http://www.djangoproject.com/',
'http://qiwi.com/',
'http://adlure.net/',
'http://www.stitchfix.com/',
'http://www.bankofthewest.com/',
'http://roem.ru/',
'http://www.carthrottle.com/',
'http://pass.yandex.kz/?retpath=http%3A%2F%2Fwww.yandex.kz%2F',
'http://gumroad.com/',
'http://www.hosteurope.de/',
'http://www.canva.com/',
'http://www.usbank.com/',
'http://evernote.com/',
'http://secure.actblue.com/',
'http://myspace.com/',
'http://www.jbhifi.com.au',
'http://www.physicsforums.com/',
'http://www.abnamro.nl/nl/index.html',
'http://twittercommunity.com/',
'http://wikileaks.org/',
'http://www.chmail.ir/',
'http://mail.ru',
'http://www.victoriassecret.com/',
'http://www.firstnational.com/',
'http://www.dominos.co.uk/',
'http://www.edmodo.com/',
'http://www.indiblogger.in/',
'http://www.zendesk.com/',
'http://www.hypovereinsbank.de/',
'http://www.openshift.com/',
'http://buffer.com/',
'http://what.cd/',
'http://hide.me/',
'http://trello.com/',
'http://www.comodo.com/',
'http://twilio.com/',
'http://www.alternate.de/',
'http://telegram.org/',
'http://www.manageengine.com/',
'http://unsw.edu.au/',
'http://www.flipkey.com/',
'http://www.popads.net/',
'http://myworkday.com/',
'http://www.meneame.net/',
'http://popcorntime.io/',
'http://iqoption.com/',
'http://www.tumblr.com/',
'http://www.reddit.com/',
'http://www.petfinder.com/',
'http://www.messenger.com/',
'http://www.digitalpoint.com/',
'http://www.blibli.com/',
'http://namu.wiki/',
'http://launchpad.net/',
'http://www.blognone.com/',
'http://www.ing.be/en/retail/Pages/index.aspx',
'http://acrobat.com/',
'http://mbank.pl/',
'http://www.fasttech.com/',
'http://www.post.ch/de',
'http://gyazo.com/',
'http://packagecontrol.io/',
'http://vimeo.com/',
'http://www.airbnb.es/',
'http://www.airbnb.it/',
'http://www.airbnb.fr/',
'http://www.airbnb.co.kr/',
'http://www.airbnb.de/',
'http://www.airbnb.co.uk/',
'http://www.airbnb.com.au/',
'http://www.airbnb.ca/',
'http://www.airbnb.co.in/',
'http://www.airbnb.com.br/',
'http://www.airbnb.ru/',
'http://www.centrum24.pl/centrum24-web/login',
'http://coursera.org/',
'http://ellislab.com/',
'http://www.udacity.com/',
'http://bitcointalk.org/',
'http://uwaterloo.ca/',
'http://vc.ru/',
'http://tjournal.ru/',
'http://www.biblegateway.com/',
'http://www.themuse.com',
'http://att.yahoo.com/',
'http://www.yahoo.com/',
'http://ficbook.net/',
'http://www.ameriprise.com/',
'http://www.here.com/',
'http://www.rocketlawyer.com/',
'http://exmo.com/',
'http://skladchik.com/',
'http://healthunlocked.com/',
'http://www.upwork.com/',
'http://www.thegioididong.com/',
'http://fermasosedi.ru/',
'http://www.thegrommet.com/',
'http://www.freelancer.com/',
'http://www.freelancer.in/',
'http://klout.com/',
'http://www.veikkaus.fi/',
'http://www.lucidchart.com/',
'http://www.opensuse.org/',
'http://monitorbacklinks.com/',
'http://www.5giay.vn/',
'http://hackpad.com/'];

/**
 * Our CSP policy (HTTP-only images) causes this to fire whenever the img src
 * redirects to HTTPS, either by HSTS (307) or plain old redirects (301/302).
 * @param {number} start
 * @param {string} host
 * @private
 */
function onImgError_(start, host) {
  var time = new Date().getTime() - start;
  if (host === BENCHMARK_HOST) {
    // This is a calibration measurement so update the offset time.
    OFFSET = time;
  } else {
    display(host, time - OFFSET, OFFSET);
  }
}

/**
 * Times how long a request takes by loading it as an img src and waiting for
 * the error to fire. I would use XHR here but it turns out CORS errors fire
 * before CSP.
 * @param {string} host
 */
function timeRequest(host) {
  var img = new Image();
  img.onerror = onImgError_.bind(this, new Date().getTime(), host);
  img.src = host + '?foobar' + Math.random().toString().substring(2);
}

/**
 * Measures the calibration drift so we have a better estimate of how long
 * a resource fetch actually took. Since we expect the time T to fetch a
 * preloaded STS host to be ~constant, the fact that it changes indicates
 * that our timing is getting skewed by some amount, probably due to JIT
 * optimization. Correct for the skew by subtracting T from measurements that
 * happen shortly after.
 */
function calibrateTime() {
  timeRequest(BENCHMARK_HOST);
}

/**
 * Display the results.
 * @param {string} url
 * @param {number} time
 * @param {number} offset
 */
function display(url, time, offset) {
  var li = document.createElement('li');
  var host = url.replace('http://', '').split('/')[0];
  li.appendChild(document.createTextNode(host));
  if (time < TIMING_UPPER_THRESHOLD && time > TIMING_LOWER_THRESHOLD) {
    console.log(url, time, offset);
    visitedElem.appendChild(li);
  } else {
    notVisitedElem.appendChild(li);
  }
}

// Main loop
hosts.forEach(function(host) {
  calibrateTime();
  timeRequest(host);
});