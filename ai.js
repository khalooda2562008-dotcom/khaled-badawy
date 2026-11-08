/* NEXUS — مساعد ذكي (OpenAI) — ملف مستقل، بدون أي مكتبات */
(() => {
  const CFG = window.NEXUS_AI || {};
  const LS = "nx-ai-key";
  const key = () => (localStorage.getItem(LS) || CFG.key || "").trim();
  const $ = (s, r = document) => r.querySelector(s);

  const css = `
  #aiF{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:19;display:inline-flex;align-items:center;gap:8px;min-height:52px;padding:0 18px;border-radius:99px;border:0;font:inherit;font-weight:800;cursor:pointer;color:#05060d;background:linear-gradient(135deg,var(--ac),var(--ac2));box-shadow:0 18px 40px -14px var(--ac)}
  #aiP{position:fixed;z-index:40;inset:auto 0 0 0;height:76vh;max-height:640px;display:none;flex-direction:column;background:var(--bg2);border:1px solid var(--bd);border-radius:22px 22px 0 0;box-shadow:0 -20px 60px rgba(0,0,0,.65);overflow:hidden}
  #aiP.o{display:flex}
  @media(min-width:900px){#aiP{inset:auto 24px 24px auto;width:400px;height:70vh;border-radius:22px}}
  #aiH{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--bd);background:var(--card)}
  #aiH b{font-size:1rem}#aiH .sp{flex:1}
  #aiH button{width:38px;height:38px;border-radius:12px;border:1px solid var(--bd);background:transparent;color:var(--tx);font-size:1.1rem;cursor:pointer}
  #aiM{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;font-size:.95rem;line-height:1.7}
  .aiB{max-width:88%;padding:10px 14px;border-radius:16px;white-space:pre-wrap;word-break:break-word;border:1px solid var(--bd)}
  .aiB.u{align-self:flex-start;background:linear-gradient(135deg,var(--ac),var(--ac2));color:#05060d;border:0;font-weight:700}
  .aiB.a{align-self:flex-end;background:var(--card)}
  .aiB.e{align-self:center;color:#f87171;font-size:.85rem;background:transparent;border:0}
  #aiRow{display:flex;gap:8px;padding:10px;border-top:1px solid var(--bd);background:var(--card)}
  #aiRow textarea{flex:1;resize:none;min-height:46px;max-height:120px;padding:10px 12px;border-radius:14px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:inherit}
  #aiRow button{min-width:52px;border-radius:14px;border:0;font:inherit;font-weight:800;cursor:pointer;color:#05060d;background:linear-gradient(135deg,var(--ac),var(--ac2))}
  #aiRow button[disabled]{opacity:.45}
  #aiS{padding:14px;display:none;gap:10px;flex-direction:column}
  #aiS.o{display:flex}
  #aiS input{width:100%;padding:10px 12px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:inherit}
  #aiS .mut{font-size:.8rem}
  `;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  const fab = document.createElement("button");
  fab.id = "aiF";
  fab.type = "button";
  fab.innerHTML = "✨ اسأل عني";
  fab.setAttribute("aria-label", "افتح المساعد الذكي");
  document.body.appendChild(fab);

  const P = document.createElement("section");
  P.id = "aiP";
  P.setAttribute("role", "dialog");
  P.setAttribute("aria-label", "المساعد الذكي");
  P.innerHTML = `<div id="aiH"><b>المساعد الذكي</b><span class="sp"></span>
    <button type="button" id="aiG" aria-label="الإعدادات">⚙</button>
    <button type="button" id="aiX" aria-label="إغلاق">✕</button></div>
    <div id="aiS"><label class="mut">مفتاح OpenAI (يُحفظ على جهازك فقط)</label>
      <input id="aiK" type="password" dir="ltr" placeholder="sk-..." autocomplete="off">
      <div class="row" style="display:flex;gap:8px"><button class="btn p" type="button" id="aiV">حفظ</button>
      <button class="btn" type="button" id="aiD">مسح المفتاح</button></div>
      <p class="mut">المفتاح لا يُرسل لأي مكان غير api.openai.com.</p></div>
    <div id="aiM" role="log" aria-live="polite"></div>
    <form id="aiRow"><textarea id="aiQ" rows="1" placeholder="اسأل أي حاجة عن صاحب الموقع…" aria-label="سؤالك"></textarea>
    <button id="aiB" type="submit" aria-label="إرسال">إرسال</button></form>`;
  document.body.appendChild(P);

  const M = $("#aiM", P), Q = $("#aiQ", P), B = $("#aiB", P), S = $("#aiS", P), KI = $("#aiK", P);
  const hist = [];

  function bubble(t, cls) {
    const d = document.createElement("div");
    d.className = "aiB " + cls;
    d.textContent = t;
    M.appendChild(d);
    M.scrollTop = M.scrollHeight;
    return d;
  }

  function ctx() {
    const raw = window.__NX_AI_CTX;
    if (raw) return raw;
    return "لا توجد بيانات منشورة بعد.";
  }

  async function loadCtx() {
    if (window.__NX_AI_CTX) return;
    try {
      const r = await fetch("data.json", { cache: "no-cache" });
      const d = await r.json();
      const clean = JSON.parse(JSON.stringify(d, (k, v) => {
        if (typeof v === "string" && (v.startsWith("data:") || v.length > 700)) return "…";
        return v;
      }));
      window.__NX_AI_CTX = ("معلومات صاحب الموقع (JSON):\n" + JSON.stringify(clean)).slice(0, 6000);
    } catch { window.__NX_AI_CTX = "لا توجد بيانات منشورة بعد."; }
  }

  async function ask(text) {
    if (!key()) {
      bubble("محتاج مفتاح OpenAI الأول. دوس ⚙ وحطه، أو فعّل المفتاح من إعدادات النشر.", "e");
      S.classList.add("o");
      return;
    }
    hist.push({ role: "user", content: text });
    const out = bubble("…", "a");
    B.disabled = true;
    try {
      const r = await fetch((CFG.base || "https://api.openai.com/v1") + "/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + key() },
        body: JSON.stringify({
          model: CFG.model || "gpt-4o-mini",
          stream: true,
          messages: [
            { role: "system", content: "أنت مساعد ودود في موقع شخصي. جاوب بالعربية، باختصار وبأسلوب بشري، بالاعتماد فقط على المعلومات التالية. لو المعلومة غير موجودة قول إنها غير متاحة واقترح التواصل مع صاحب الموقع.\n" + ctx() },
            ...hist.slice(-8)
          ]
        })
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        const msg = (j.error && j.error.message) || r.status;
        out.className = "aiB e";
        out.textContent = r.status === 401 ? "المفتاح غير صالح أو منتهي." :
          (j.error && j.error.code === "billing_not_active") ? "حساب OpenAI محتاج رصيد/تفعيل فاتورة عشان المساعد يشتغل." :
          r.status === 429 ? "تجاوزنا الحد أو الرصيد غير كافٍ." :
          "خطأ من OpenAI: " + msg;
        return;
      }
      let acc = "";
      out.textContent = "";
      const rd = r.body.getReader(), dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n");
        buf = parts.pop();
        for (const line of parts) {
          const s = line.trim();
          if (!s.startsWith("data:")) continue;
          const data = s.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const t = j.choices?.[0]?.delta?.content || "";
            if (t) { acc += t; out.textContent = acc; M.scrollTop = M.scrollHeight; }
          } catch {}
        }
      }
      if (!acc) out.textContent = "مفيش رد، جرّب تاني.";
      hist.push({ role: "assistant", content: acc });
    } catch (e) {
      out.className = "aiB e";
      out.textContent = "تعذر الاتصال. اتأكد من الإنترنت.";
    } finally { B.disabled = false; }
  }

  fab.onclick = () => {
    P.classList.toggle("o");
    if (P.classList.contains("o")) { loadCtx(); if (!key()) S.classList.add("o"); Q.focus(); }
  };
  $("#aiX", P).onclick = () => P.classList.remove("o");
  $("#aiG", P).onclick = () => { S.classList.toggle("o"); if (S.classList.contains("o")) { KI.value = ""; KI.placeholder = key() ? "مفتاح محفوظ — اكتب واحد جديد للتغيير" : "sk-..."; } };
  $("#aiV", P).onclick = () => {
    const v = KI.value.trim();
    if (!v.startsWith("sk-")) return bubble("المفتاح يبدأ بـ sk-", "e");
    localStorage.setItem(LS, v); KI.value = ""; S.classList.remove("o"); bubble("تم حفظ المفتاح على جهازك ✓", "e");
  };
  $("#aiD", P).onclick = () => { localStorage.removeItem(LS); KI.value = ""; bubble("تم مسح المفتاح.", "e"); };
  $("#aiRow", P).onsubmit = e => {
    e.preventDefault();
    const t = Q.value.trim();
    if (!t || B.disabled) return;
    Q.value = ""; Q.style.height = "";
    bubble(t, "u");
    ask(t);
  };
  Q.addEventListener("input", () => { Q.style.height = "auto"; Q.style.height = Math.min(Q.scrollHeight, 120) + "px"; });
  Q.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); $("#aiRow", P).requestSubmit(); } });
  addEventListener("keydown", e => e.key === "Escape" && P.classList.remove("o"));
})();
