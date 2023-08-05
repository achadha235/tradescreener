// @ts-nocheck
import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
});

export const useFullStory = process.env.NODE_ENV === "production";
// export const useFullStory = true;

if (typeof window !== "undefined") {
  (window as any)["analytics"] = analytics;

  if (useFullStory) {
    window["_fs_host"] = "fullstory.com";
    window["_fs_script"] = "edge.fullstory.com/s/fs.js";
    window["_fs_org"] = "14NB9C";
    window["_fs_namespace"] = "FS";
    (function (m, n, e, t, l, o, g, y) {
      if (e in m) {
        if (m.console && m.console.log) {
          m.console.log(
            'FullStory namespace conflict. Please set window["_fs_namespace"].'
          );
        }
        return;
      }
      g = m[e] = function (a, b, s) {
        g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
      };
      g.q = [];
      o = n.createElement(t);
      o.async = 1;
      o.crossOrigin = "anonymous";
      o.src = "https://" + _fs_script;
      y = n.getElementsByTagName(t)[0];
      y.parentNode.insertBefore(o, y);
      g.identify = function (i, v, s) {
        g(l, { uid: i }, s);
        if (v) g(l, v, s);
      };
      g.setUserVars = function (v, s) {
        g(l, v, s);
      };
      g.event = function (i, v, s) {
        g("event", { n: i, p: v }, s);
      };
      g.anonymize = function () {
        g.identify(!!0);
      };
      g.shutdown = function () {
        g("rec", !1);
      };
      g.restart = function () {
        g("rec", !0);
      };
      g.log = function (a, b) {
        g("log", [a, b]);
      };
      g.consent = function (a) {
        g("consent", !arguments.length || a);
      };
      g.identifyAccount = function (i, v) {
        o = "account";
        v = v || {};
        v.acctId = i;
        g(o, v);
      };
      g.clearUserCookie = function () {};
      g.setVars = function (n, p) {
        g("setVars", [n, p]);
      };
      g._w = {};
      y = "XMLHttpRequest";
      g._w[y] = m[y];
      y = "fetch";
      g._w[y] = m[y];
      if (m[y])
        m[y] = function () {
          return g._w[y].apply(this, arguments);
        };
      g._v = "1.3.0";
    })(window, document, window["_fs_namespace"], "script", "user");
  }

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  fbq("init", "193438603507630");
  fbq("track", "PageView");
}

export function trackFullstory(eventName, properties) {
  if (typeof window !== "undefined" && typeof FS !== "undefined") {
    FS.event(eventName, properties);
  }
}
