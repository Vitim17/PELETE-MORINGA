/* ============================================================
   MORINGA HORSE — JavaScript de Alta Conversão
   Agromoringa | Arthur Begliomini Agronegócios
   ============================================================ */

   'use strict';

   /* ---- Utilidades ---- */
   const $ = (sel, ctx = document) => ctx.querySelector(sel);
   const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
   
   /* ============================================================
      1. COUNTDOWN TIMER — Urgência Real
      Reinicia a cada sessão com 4h a partir da abertura
      ============================================================ */
   (function initCountdown() {
     const STORAGE_KEY = 'moringa_horse_deadline';
     const DURATION_MS = 4 * 60 * 60 * 1000;
   
     let deadline = parseInt(sessionStorage.getItem(STORAGE_KEY), 10);
   
     if (!deadline || deadline < Date.now()) {
       deadline = Date.now() + DURATION_MS;
       sessionStorage.setItem(STORAGE_KEY, deadline);
     }
   
     function pad(n) {
       return String(n).padStart(2, '0');
     }
   
     function tick() {
       let diff = deadline - Date.now();
   
       if (diff <= 0) {
         deadline = Date.now() + DURATION_MS;
         sessionStorage.setItem(STORAGE_KEY, deadline);
         diff = deadline - Date.now();
       }
   
       const h = Math.floor(diff / 3600000);
       const m = Math.floor((diff % 3600000) / 60000);
       const s = Math.floor((diff % 60000) / 1000);
   
       const hoursEl = $('#hours');
       const minutesEl = $('#minutes');
       const secondsEl = $('#seconds');
   
       if (hoursEl) hoursEl.textContent = pad(h);
       if (minutesEl) minutesEl.textContent = pad(m);
       if (secondsEl) secondsEl.textContent = pad(s);
     }
   
     tick();
     setInterval(tick, 1000);
   })();
   
   /* ============================================================
      2. STOCK COUNTER — Escassez Dinâmica
      Simula contagem regressiva de estoque
      ============================================================ */
   (function initStockCounter() {
     const STOCK_KEY = 'moringa_horse_stock';
     const BASE_STOCK = 9;
   
     let stock = parseInt(sessionStorage.getItem(STOCK_KEY), 10);
   
     if (!stock || stock < 1) {
       stock = BASE_STOCK;
       sessionStorage.setItem(STOCK_KEY, stock);
     }
   
     const stockEl = $('#stock-count');
     if (stockEl) stockEl.textContent = `${stock} kits`;
   
     function decreaseStock() {
       if (stock > 2) {
         stock -= 1;
         sessionStorage.setItem(STOCK_KEY, stock);
   
         if (stockEl) {
           stockEl.textContent = `${stock} kits`;
           stockEl.style.color = '#ff6666';
   
           setTimeout(() => {
             stockEl.style.color = '';
           }, 1000);
         }
       }
   
       scheduleDecrease();
     }
   
     function scheduleDecrease() {
       const delay = (Math.random() * 4 + 3) * 60 * 1000;
       setTimeout(decreaseStock, delay);
     }
   
     scheduleDecrease();
   })();
   
   /* ============================================================
      3. SCROLL ANIMATIONS — Fade Up
      ============================================================ */
   (function initScrollAnimations() {
     const targets = [
       '.nutrient-card',
       '.benefit-card',
       '.testimonial-card',
       '.trust-card',
       '.video-card',
       '.comparison-card',
       '.comparison-wrapper',
       '.benefits-banner',
       '.social-proof-bar',
       '.final-cta-block',
       '.countdown-wrapper',
       '.offer-card',
     ];
   
     targets.forEach(selector => {
       $$(selector).forEach((el, i) => {
         el.classList.add('fade-up');
         el.style.transitionDelay = `${i * 0.08}s`;
       });
     });
   
     const observer = new IntersectionObserver(
       entries => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             entry.target.classList.add('visible');
             observer.unobserve(entry.target);
           }
         });
       },
       {
         threshold: 0.12,
         rootMargin: '0px 0px -40px 0px',
       }
     );
   
     $$('.fade-up').forEach(el => observer.observe(el));
   })();
   
   /* ============================================================
      4. COUNTER ANIMATION — Números que animam ao aparecer
      ============================================================ */
   (function initCounterAnimation() {
     const counterEls = $$('.proof-number');
     if (!counterEls.length) return;
   
     function animateCounter(el) {
       const target = parseInt(el.getAttribute('data-target'), 10);
       const duration = 1800;
       const step = 16;
       const increment = target / (duration / step);
       let current = 0;
   
       const timer = setInterval(() => {
         current += increment;
   
         if (current >= target) {
           current = target;
           clearInterval(timer);
         }
   
         el.textContent = Math.floor(current).toLocaleString('pt-BR');
       }, step);
     }
   
     const observer = new IntersectionObserver(
       entries => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             animateCounter(entry.target);
             observer.unobserve(entry.target);
           }
         });
       },
       { threshold: 0.5 }
     );
   
     counterEls.forEach(el => observer.observe(el));
   })();
   
   /* ============================================================
      5. STICKY CTA — Aparece após rolar além do hero
      ============================================================ */
   (function initStickyCTA() {
     const sticky = $('#sticky-cta');
     if (!sticky) return;
   
     const heroEl = $('#hero');
     let lastScroll = 0;
   
     function updateSticky() {
       const scrollY = window.scrollY;
       const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 600;
   
       if (scrollY > heroBottom - 200) {
         sticky.style.display = 'block';
       } else {
         sticky.style.display = 'none';
       }
   
       if (scrollY < lastScroll && scrollY > heroBottom) {
         sticky.style.transform = 'translateY(100%)';
       } else {
         sticky.style.transform = 'translateY(0)';
       }
   
       lastScroll = scrollY;
     }
   
     sticky.style.transition = 'transform 0.3s ease';
     window.addEventListener('scroll', updateSticky, { passive: true });
     updateSticky();
   })();
   
   /* ============================================================
      6. SMOOTH SCROLL para links âncora
      ============================================================ */
   (function initSmoothScroll() {
     $$('a[href^="#"]').forEach(link => {
       link.addEventListener('click', e => {
         const targetId = link.getAttribute('href').slice(1);
         const targetEl = document.getElementById(targetId);
   
         if (targetEl) {
           e.preventDefault();
   
           const offset = 60;
           const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
   
           window.scrollTo({
             top,
             behavior: 'smooth',
           });
         }
       });
     });
   })();
   
   /* ============================================================
      7. URGENCY BAR — Mensagens rotativas
      ============================================================ */
   (function initUrgencyBar() {
     const bar = $('#urgency-bar');
     if (!bar) return;
   
     const messages = [
       '🔥 ATENÇÃO: Estoque limitado para este mês — <strong>restam poucas unidades</strong> disponíveis! 🔥',
       '⏰ Promoção por tempo limitado — <strong>Preço pode subir a qualquer momento!</strong> ⏰',
       '👥 <strong>+500 produtores</strong> já estão usando Moringa Peletizada nos seus cavalos! 🌿',
       '💚 Alta procura! <strong>Garanta o seu kit agora</strong> antes que acabe o estoque! 🐴',
     ];
   
     let idx = 0;
     const textEl = bar.querySelector('.urgency-text');
   
     setInterval(() => {
       idx = (idx + 1) % messages.length;
   
       if (textEl) {
         textEl.style.opacity = '0';
   
         setTimeout(() => {
           textEl.innerHTML = messages[idx];
           textEl.style.opacity = '1';
         }, 300);
   
         textEl.style.transition = 'opacity 0.3s ease';
       }
     }, 5000);
   })();
   
   /* ============================================================
      8. POPUP DE SAÍDA — Exit Intent
      ============================================================ */
   (function initExitIntent() {
     let triggered = false;
   
     document.addEventListener('mouseleave', e => {
       if (e.clientY > 0 || triggered) return;
   
       triggered = true;
   
       const popup = document.createElement('div');
       popup.id = 'exit-popup';
   
       popup.innerHTML = `
         <div class="exit-overlay"></div>
         <div class="exit-box">
           <button class="exit-close" id="close-exit-popup">✕</button>
           <div class="exit-emoji">🐴</div>
           <h2>Espera! Seu cavalo merece o melhor.</h2>
           <p>Antes de sair, aproveite esta oferta exclusiva por <strong>tempo limitado</strong>:</p>
           <div class="exit-price">
             <span class="exit-old">R$297,00</span>
             <span class="exit-new">R$150,00</span>
           </div>
           <p class="exit-sub">Isso é menos de <strong>R$2,28 por dia</strong> para transformar a saúde do seu cavalo.</p>
           <a href="https://agro-moringa.myshopify.com/cart/45699819864247:1" target="_blank" rel="noopener noreferrer" class="exit-btn">
             <span>🌿</span> SIM, QUERO APROVEITAR AGORA!
           </a>
           <button class="exit-dismiss" id="exit-dismiss-btn">Não, dispenso a oferta</button>
         </div>
       `;
   
       document.body.appendChild(popup);
   
       const closePopup = () => {
         popup.remove();
       };
   
       document.getElementById('close-exit-popup')?.addEventListener('click', closePopup);
       document.getElementById('exit-dismiss-btn')?.addEventListener('click', closePopup);
       popup.querySelector('.exit-overlay')?.addEventListener('click', closePopup);
     });
   })();
   
   /* ============================================================
      9. NOTIFICAÇÃO FLUTUANTE — Prova social em tempo real
      ============================================================ */
   (function initSocialNotification() {
     const buyers = [
       { name: 'João S.', location: 'Teresina-PI', time: '2 min atrás' },
       { name: 'Maria L.', location: 'Fortaleza-CE', time: '5 min atrás' },
       { name: 'Carlos M.', location: 'Natal-RN', time: '8 min atrás' },
       { name: 'Pedro A.', location: 'Salvador-BA', time: '12 min atrás' },
       { name: 'Ana R.', location: 'Recife-PE', time: '3 min atrás' },
       { name: 'Marcos F.', location: 'Palmas-TO', time: '7 min atrás' },
       { name: 'Luiz H.', location: 'Imperatriz-MA', time: '15 min atrás' },
       { name: 'Fernanda C.', location: 'Mossoró-RN', time: '1 min atrás' },
     ];
   
     function showNotification() {
       const buyer = buyers[Math.floor(Math.random() * buyers.length)];
   
       const notif = document.createElement('div');
       notif.className = 'social-notif';
   
       notif.innerHTML = `
         <div class="notif-icon">🐴</div>
         <div class="notif-text">
           <strong>${buyer.name}</strong> de ${buyer.location}<br>
           <span>acabou de comprar Moringa Horse · ${buyer.time}</span>
         </div>
       `;
   
       document.body.appendChild(notif);
   
       setTimeout(() => {
         notif.classList.add('notif-visible');
       }, 100);
   
       setTimeout(() => {
         notif.classList.remove('notif-visible');
   
         setTimeout(() => {
           notif.remove();
         }, 500);
       }, 5000);
     }
   
     setTimeout(() => {
       showNotification();
       setInterval(showNotification, Math.random() * 15000 + 25000);
     }, 12000);
   })();
   
   /* ============================================================
      10. INJEÇÃO DE ESTILOS DINÂMICOS
      ============================================================ */
   (function injectDynamicStyles() {
     const style = document.createElement('style');
   
     style.textContent = `
       #exit-popup {
         position: fixed;
         inset: 0;
         z-index: 9999;
         display: flex;
         align-items: center;
         justify-content: center;
         padding: 20px;
       }
   
       .exit-overlay {
         position: absolute;
         inset: 0;
         background: rgba(0,0,0,0.82);
       }
   
       .exit-box {
         position: relative;
         background: linear-gradient(145deg, #1a3d1e, #0d1f0f);
         border: 2px solid rgba(212,160,23,0.5);
         border-radius: 20px;
         padding: 44px 36px;
         max-width: 480px;
         width: 100%;
         text-align: center;
         color: #fff;
         box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,160,23,0.15);
       }
   
       .exit-close {
         position: absolute;
         top: 14px;
         right: 16px;
         background: rgba(255,255,255,0.1);
         border: none;
         color: rgba(255,255,255,0.7);
         font-size: 1rem;
         width: 28px;
         height: 28px;
         border-radius: 50%;
         cursor: pointer;
         line-height: 1;
       }
   
       .exit-emoji {
         font-size: 3rem;
         margin-bottom: 12px;
       }
   
       .exit-box h2 {
         font-family: 'Montserrat', sans-serif;
         font-size: 1.5rem;
         font-weight: 900;
         margin-bottom: 10px;
         line-height: 1.2;
       }
   
       .exit-box p {
         font-size: 0.92rem;
         color: rgba(255,255,255,0.8);
         margin-bottom: 16px;
       }
   
       .exit-price {
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 16px;
         margin: 16px 0;
       }
   
       .exit-old {
         font-family: 'Montserrat', sans-serif;
         font-size: 1.1rem;
         text-decoration: line-through;
         color: rgba(255,255,255,0.4);
       }
   
       .exit-new {
         font-family: 'Montserrat', sans-serif;
         font-size: 2.2rem;
         font-weight: 900;
         color: #f0c040;
       }
   
       .exit-sub {
         font-size: 0.85rem !important;
         margin-bottom: 24px !important;
       }
   
       .exit-btn {
         display: inline-flex;
         align-items: center;
         justify-content: center;
         gap: 8px;
         background: linear-gradient(135deg, #2d7a35, #3ea647);
         color: #fff;
         font-family: 'Montserrat', sans-serif;
         font-size: 0.95rem;
         font-weight: 800;
         letter-spacing: 0.05em;
         text-transform: uppercase;
         padding: 16px 32px;
         border-radius: 100px;
         width: 100%;
         margin-bottom: 12px;
         box-shadow: 0 6px 24px rgba(46,122,53,0.5);
         transition: all 0.3s ease;
         text-decoration: none;
       }
   
       .exit-btn:hover {
         background: linear-gradient(135deg, #3ea647, #4caf50);
         transform: translateY(-2px);
       }
   
       .exit-dismiss {
         background: none;
         border: none;
         color: rgba(255,255,255,0.35);
         font-size: 0.78rem;
         cursor: pointer;
         text-decoration: underline;
         transition: color 0.3s;
       }
   
       .exit-dismiss:hover {
         color: rgba(255,255,255,0.6);
       }
   
       .social-notif {
         position: fixed;
         bottom: 100px;
         left: 20px;
         z-index: 9998;
         background: #1e1e1e;
         border: 1px solid rgba(255,255,255,0.12);
         border-left: 4px solid #2d7a35;
         border-radius: 12px;
         padding: 14px 18px;
         display: flex;
         align-items: center;
         gap: 12px;
         max-width: 290px;
         box-shadow: 0 8px 28px rgba(0,0,0,0.35);
         transform: translateX(-120%);
         transition: transform 0.4s cubic-bezier(0.25,0.8,0.25,1);
         color: #fff;
       }
   
       .social-notif.notif-visible {
         transform: translateX(0);
       }
   
       .notif-icon {
         font-size: 1.6rem;
         flex-shrink: 0;
       }
   
       .notif-text {
         font-size: 0.8rem;
         line-height: 1.5;
       }
   
       .notif-text strong {
         display: block;
         font-size: 0.85rem;
       }
   
       .notif-text span {
         color: rgba(255,255,255,0.55);
         font-size: 0.75rem;
       }
   
       @media (max-width: 480px) {
         .exit-box {
           padding: 36px 24px;
         }
   
         .exit-box h2 {
           font-size: 1.25rem;
         }
   
         .social-notif {
           max-width: 260px;
         }
       }
     `;
   
     document.head.appendChild(style);
   })();
   
   /* ============================================================
      11. CTA TRACKER — Analytics de cliques nos botões
      ============================================================ */
   (function initCTATracker() {
     $$('.btn-cta').forEach(btn => {
       btn.addEventListener('click', () => {
         btn.style.transform = 'scale(0.97)';
   
         setTimeout(() => {
           btn.style.transform = '';
         }, 150);
       });
     });
   })();
   
   /* ============================================================
      12. VÍDEOS — reprodução inline ao clicar no play
      ============================================================ */
   (function initInlineVideos() {
     const players = $$('.video-player');
     if (!players.length) return;
   
     const relaySrc = (id) => {
       const params = new URLSearchParams({ v: id, autoplay: '1' });
       return `embed/youtube?${params.toString()}`;
     };
   
     players.forEach(player => {
       const trigger = $('.video-play-trigger', player);
       if (!trigger) return;
   
       trigger.addEventListener('click', () => {
         if (player.classList.contains('is-playing')) return;
   
         const id = player.dataset.videoId;
         if (!id) return;
   
         if (location.protocol === 'file:') {
           window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, '_blank', 'noopener');
           return;
         }
   
         const iframe = document.createElement('iframe');
         iframe.src = relaySrc(id);
         iframe.title = player.dataset.videoTitle || 'Vídeo Agromoringa';
         iframe.setAttribute('frameborder', '0');
         iframe.setAttribute('allowfullscreen', '');
         iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
         iframe.setAttribute(
           'allow',
           'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
         );
   
         player.classList.add('is-playing');
         player.innerHTML = '';
         player.appendChild(iframe);
       });
     });
   })();
   
   /* ============================================================
      DOMContentLoaded — Inicialização final
      ============================================================ */
   document.addEventListener('DOMContentLoaded', () => {
     const heroContent = $('.hero-content');
   
     if (heroContent) {
       heroContent.style.opacity = '0';
       heroContent.style.transform = 'translateY(24px)';
       heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
   
       setTimeout(() => {
         heroContent.style.opacity = '1';
         heroContent.style.transform = 'translateY(0)';
       }, 200);
     }
   
     console.log('%c🌿 Agromoringa — Moringa Horse', 'color:#3ea647;font-size:16px;font-weight:bold;');
     console.log('%cA Revolução Nutricional para o Seu Cavalo', 'color:#f0c040;font-size:12px;');
   });