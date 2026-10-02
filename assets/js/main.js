/* 11/7 学校説明会 LP。Tako_LP_One-Shot の共通モーション（parts/motion.js）を元に必要な分だけ。 */
(function () {
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined";
  var root = document.documentElement;
  root.classList.add(reduced ? "no-motion" : "motion");

  /* 申込締切（2026/11/6 9:00 JST）を過ぎたら、ボタンを「受付は終了しました」に切り替える */
  var DEADLINE = Date.parse("2026-11-06T09:00:00+09:00");
  var closed = Date.now() >= DEADLINE;

  /* 申込ボタン：apply 中継（click_apply を記録してミライコンパスへ）。go 中継や広告から来た人は、その出どころを s に足して区別する */
  var q = new URLSearchParams(location.search);
  var src = "lp";
  if (q.get("utm_source")) src += "_" + q.get("utm_source") + (q.get("utm_content") ? "_" + q.get("utm_content") : "");
  else if (q.get("src") || q.get("s")) src += "_" + (q.get("src") || q.get("s"));
  src = src.replace(/[^a-z0-9_]/gi, "").slice(0, 40);
  document.querySelectorAll(".js-cta").forEach(function (a) {
    if (closed) {
      a.removeAttribute("href");
      a.classList.add("is-closed");
      a.setAttribute("aria-disabled", "true");
      var label = a.querySelector("span") || a;
      if (a.classList.contains("sticky__btn")) a.innerHTML = "受付は終了しました";
      else if (a.classList.contains("hd__cta")) a.textContent = "受付終了";
      else label.textContent = "受付は終了しました";
      return;
    }
    a.setAttribute("href", "apply/?s=" + encodeURIComponent(src));
    a.addEventListener("click", function (e) {
      if (typeof gtag !== "function") return;
      /* 送信を待ってから移動する（すぐ移動すると cta_click が送られないことがある）。最大0.4秒 */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) { gtag("event", "cta_click", { cta_location: a.getAttribute("data-cta-location"), source: src }); return; }
      e.preventDefault();
      var href = a.getAttribute("href"), done = false;
      function go() { if (!done) { done = true; location.href = href; } }
      gtag("event", "cta_click", { cta_location: a.getAttribute("data-cta-location"), source: src, transport_type: "beacon", event_callback: go });
      setTimeout(go, 400);
    });
  });
  if (closed) document.querySelectorAll(".hero__dl").forEach(function (p) { p.textContent = "お申し込みの受付は終了しました"; });

  /* ヘッダーと固定ボタン */
  var hd = document.getElementById("hd"), sticky = document.getElementById("sticky");
  var heroInfo = document.querySelector(".hero__info .btn");
  function onScroll() {
    var y = scrollY;
    hd.classList.toggle("is-scrolled", y > 60);
    var r = heroInfo ? heroInfo.getBoundingClientRect() : null;
    sticky.classList.toggle("is-on", !r || r.bottom < 0);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* 登場 */
  var els = document.querySelectorAll(".in");
  if (reduced || !("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  /* 保険：何かで止まっても 4 秒後には全部見せる */
  setTimeout(function () { els.forEach(function (e) { e.classList.add("is-in"); }); }, 4000);

  /* タブ（当日のプログラム） */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.classList.toggle("is-on", on);
        o.setAttribute("aria-selected", on ? "true" : "false");
        var p = document.getElementById(o.getAttribute("aria-controls"));
        p.hidden = !on; p.classList.toggle("is-on", on);
      });
    });
  });

  /* 文字点灯（願いの一文）：スクロールに合わせて1文字ずつ濃くなる */
  var light = document.querySelector(".js-light");
  if (light && !reduced && hasGsap && typeof ScrollTrigger !== "undefined") {
    var parts = light.textContent.match(/[A-Za-z0-9,.']+|\S|\s+/g) || [];
    light.innerHTML = parts.map(function (p) { return /^\s+$/.test(p) ? p : '<span class="w">' + p + "</span>"; }).join("");
    var ws = light.querySelectorAll(".w");
    ws.forEach(function (w) { w.style.opacity = .2; });
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: light, start: "top 85%", end: "bottom 45%", scrub: true,
      onUpdate: function (st) { var n = Math.ceil(st.progress * ws.length); ws.forEach(function (w, i) { w.style.opacity = i < n ? 1 : .2; }); }
    });
  }

  /* ヒーローの開幕：写真がゆっくり寄り、問いが1行ずつ浮かぶ */
  if (!reduced && hasGsap) {
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".hero__photo img", { scale: 1.12 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
      .fromTo(".hero__q .mask>span", { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .16 }, .3)
      .fromTo(".hero__kicker, .hero__date, .hero__time, .hero__info .btn, .hero__dl", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .08 }, .8);

    /* 写真の視差（PC のみ） */
    if (typeof ScrollTrigger !== "undefined" && matchMedia("(min-width: 900px)").matches) {
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll(".js-par img").forEach(function (img) {
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.to(".hero__photo img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
  }
})();
