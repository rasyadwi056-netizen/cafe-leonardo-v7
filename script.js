/* V7 Final (uses your long JPG filenames in repo root) */

/* Mapping keys -> filenames (root) */
const IMAGES = {
  espresso: "4c28e2420bf38c50120dba0cbaf42e8d.jpg",
  cappuccino: "be1ef8eb64e5db54a86184f0c5860cca.jpg",
  latte: "f1c68907fc855fdd9a031347774dcc8a.jpg",
  americano: "2b470fb1f8ae1e513d636cc27e898c83.jpg",
  matcha: "5dfe58aaf87d2db13e683d76dc278e66.jpg",
  mocha: "d7233a04fd31b7c6e93a2f62fd454c78.jpg",
  macchiato: "31a43e6724513a5b4220dfc5843e930d.jpg",
  affogato: "994f146b76824cf41059154547f706ec.jpg",
  croissant: "c883409163bb441326b46975b022497e.jpg",
  muffin: "67cf87b89fbc0550ce37c680a5bf1a85.jpg",
  brownies: "b1db98a8182316a568052e8cdb3e88d9.jpg",
  sandwich: "6a60622f784ac730ab7109f2ecd040cf.jpg"
};

/* PRODUCTS list with prices (simulated realistic) */
const PRODUCTS = [
  { id:1, key:"espresso",  name:"Espresso", price:25000, category:"panas",  img:IMAGES.espresso,  desc:"Kopi pekat, diseduh klasik." },
  { id:2, key:"cappuccino",name:"Cappuccino",price:28000, category:"panas",  img:IMAGES.cappuccino,desc:"Espresso + foam susu krim." },
  { id:3, key:"latte",     name:"Latte",    price:30000, category:"panas",  img:IMAGES.latte,     desc:"Susu lembut + espresso." },
  { id:4, key:"americano", name:"Americano",price:26000, category:"dingin", img:IMAGES.americano, desc:"Espresso + air dingin." },
  { id:5, key:"matcha",    name:"Matcha Latte",price:32000, category:"dingin", img:IMAGES.matcha,    desc:"Teh hijau matcha krim." },
  { id:6, key:"mocha",     name:"Mocha",    price:33000, category:"dingin", img:IMAGES.mocha,     desc:"Cokelat + espresso + susu." },
  { id:7, key:"macchiato", name:"Macchiato",price:31000, category:"panas",  img:IMAGES.macchiato, desc:"Espresso + sedikit foam." },
  { id:8, key:"affogato",  name:"Affogato", price:35000, category:"dingin", img:IMAGES.affogato,  desc:"Espresso disiram ke es krim." },
  { id:9, key:"croissant", name:"Croissant", price:20000, category:"snack",  img:IMAGES.croissant, desc:"Renyah & buttery." },
  { id:10,key:"muffin",    name:"Muffin",   price:18000, category:"snack",  img:IMAGES.muffin,    desc:"Muffin lembut dengan blueberry." },
  { id:11,key:"brownies",  name:"Brownies", price:22000, category:"snack",  img:IMAGES.brownies,  desc:"Cokelat padat & moist." },
  { id:12,key:"sandwich",  name:"Sandwich", price:27000, category:"snack",  img:IMAGES.sandwich,  desc:"Isian segar, cocok sarapan." }
];

function rupiah(n){ return 'Rp' + Number(n).toLocaleString('id-ID') }

/* localStorage helpers */
function readCart(){ return JSON.parse(localStorage.getItem('leo_v7_cart')||'[]') }
function saveCart(c){ localStorage.setItem('leo_v7_cart', JSON.stringify(c)); updateCartCount(); }
function readTx(){ return JSON.parse(localStorage.getItem('leo_v7_tx')||'[]') }
function saveTx(t){ localStorage.setItem('leo_v7_tx', JSON.stringify(t)) }

/* cart count top */
function updateCartCount(){
  const els = document.querySelectorAll('#cartCountTop');
  const c = readCart();
  const total = c.reduce((s,i)=> s + (i.qty||0), 0);
  els.forEach(e=> e.textContent = total);
}

/* ===== INDEX: render menu grid & categories ===== */
const menuGrid = document.getElementById('menuGrid');

function renderMenu(category='all'){
  if(!menuGrid) return;
  menuGrid.innerHTML = '';
  const list = category==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.category===category);
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="meta">
        <h3>${p.name}</h3>
        <p>${rupiah(p.price)}</p>
      </div>
    `;
    card.addEventListener('click', ()=> openDetail(p.id));
    menuGrid.appendChild(card);
  });
}

/* category buttons (if present) */
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.category-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.category-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderMenu(b.dataset.cat);
    });
  });

  renderMenu('all');
  updateCartCount();

  // init detail page if exists
  if(document.getElementById('detailCard')) initDetailPage();
  if(document.getElementById('cartList')) renderCartPage();
});

/* open detail: save selected id and navigate (with small slide) */
function openDetail(id){
  localStorage.setItem('leo_v7_selected', String(id));
  document.body.classList.add('page-slide');
  setTimeout(()=> window.location.href = 'menu.html', 280);
}

/* ===== DETAIL PAGE ===== */
function initDetailPage(){
  const slot = document.getElementById('detailCard');
  if(!slot) return;
  let id = Number(localStorage.getItem('leo_v7_selected')||1);
  let idx = PRODUCTS.findIndex(p=>p.id===id);
  if(idx < 0) idx = 0;

  function show(i){
    const p = PRODUCTS[i];
    slot.innerHTML = `
      <img class="detail-img" src="${p.img}" alt="${p.name}">
      <div class="detail-info">
        <h2>${p.name}</h2>
        <p class="price"><strong>${rupiah(p.price)}</strong></p>
        <p>${p.desc}</p>
        <div class="qty"><label>Jumlah:
          <input id="qty" type="number" value="1" min="1" class="qty-input"></label></div>
        <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
          <button id="prevBtn" class="btn">← Sebelumnya</button>
          <button id="addBtn" class="btn primary">Tambah ke Keranjang</button>
          <button id="nextBtn" class="btn">Berikutnya →</button>
        </div>
      </div>
    `;
    document.getElementById('addBtn').addEventListener('click', ()=>{
      const qty = Math.max(1, parseInt(document.getElementById('qty').value)||1);
      addToCart(p.id, qty);
      alert(`${qty} x ${p.name} ditambahkan ke keranjang`);
      updateCartCount();
    });
    document.getElementById('prevBtn').addEventListener('click', ()=>{
      idx = (i - 1 + PRODUCTS.length) % PRODUCTS.length;
      localStorage.setItem('leo_v7_selected', String(PRODUCTS[idx].id));
      show(idx);
      document.body.classList.remove('page-slide'); void document.body.offsetWidth;
      document.body.classList.add('page-slide');
    });
    document.getElementById('nextBtn').addEventListener('click', ()=>{
      idx = (i + 1) % PRODUCTS.length;
      localStorage.setItem('leo_v7_selected', String(PRODUCTS[idx].id));
      show(idx);
      document.body.classList.remove('page-slide'); void document.body.offsetWidth;
      document.body.classList.add('page-slide');
    });
  }

  show(idx);
  updateCartCount();
}

/* ===== CART PAGE ===== */
function renderCartPage(){
  const cartListEl = document.getElementById('cartList');
  const checkoutTotalEl = document.getElementById('checkoutTotal');
  const historyListEl = document.getElementById('historyList');
  if(!cartListEl) return;

  const cart = readCart();
  cartListEl.innerHTML = '';
  if(cart.length === 0){
    cartListEl.innerHTML = '<div style="padding:12px;color:#6b5b52">Keranjang kosong</div>';
  } else {
    cart.forEach((it, idx)=>{
      const p = PRODUCTS.find(x=>x.id===it.id);
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="meta">
          <h4>${p.name}</h4>
          <div>${rupiah(p.price)}</div>
        </div>
        <div>
          <input class="qty-input" data-idx="${idx}" type="number" min="1" value="${it.qty}">
        </div>
        <div style="min-width:110px;text-align:right">${rupiah(p.price * it.qty)}</div>
        <div><button class="btn ghost" data-del="${idx}">Hapus</button></div>
      `;
      cartListEl.appendChild(row);
    });
  }

  const total = cart.reduce((s,i)=> s + (PRODUCTS.find(p=>p.id===i.id).price * i.qty), 0);
  checkoutTotalEl.textContent = rupiah(total);

  // events
  cartListEl.querySelectorAll('.qty-input').forEach(inp=>{
    inp.addEventListener('change', ()=>{
      const idx = Number(inp.dataset.idx);
      const val = Math.max(1, parseInt(inp.value)||1);
      const c = readCart(); c[idx].qty = val; saveCart(c); renderCartPage();
    });
  });
  cartListEl.querySelectorAll('button[data-del]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const idx = Number(b.dataset.del); const c = readCart(); c.splice(idx,1); saveCart(c); renderCartPage();
    });
  });

  // history
  renderHistory();
  updateCartCount();
}

/* add to cart */
function addToCart(id, qty=1){
  const c = readCart();
  const found = c.find(x=>x.id===id);
  if(found) found.qty += qty;
  else c.push({ id, qty });
  saveCart(c);
}

/* clear/checkout listeners (delegated) */
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id === 'clearCartBtn'){
    if(confirm('Kosongkan keranjang?')) { saveCart([]); renderCartPage(); }
  }
  if(e.target && e.target.id === 'checkoutBtn'){
    const cart = readCart();
    if(cart.length === 0){ alert('Keranjang kosong'); return; }
    const tx = readTx();
    const now = new Date();
    const total = cart.reduce((s,i)=> s + (PRODUCTS.find(p=>p.id===i.id).price * i.qty), 0);
    const rec = { id:'TX'+now.getTime(), time: now.toISOString(), items: cart, total };
    tx.unshift(rec); saveTx(tx); saveCart([]); renderCartPage();
    // print simple receipt
    const w = window.open('', '_blank');
    w.document.write(`<pre style="font-family:monospace">Leonardo Café\n${rec.id}\n${new Date(rec.time).toLocaleString()}\n\n${rec.items.map(it=>{ const p=PRODUCTS.find(x=>x.id===it.id); return `${p.name} x${it.qty}   ${rupiah(p.price*it.qty)}`}).join('\n')}\n\nTOTAL: ${rupiah(rec.total)}\n\nTerima kasih!</pre>`);
    w.document.close(); w.print();
    alert('Checkout berhasil. Struk dicetak.');
  }
});

/* history rendering */
function renderHistory(){
  const el = document.getElementById('historyList');
  if(!el) return;
  const tx = readTx();
  el.innerHTML = '';
  if(tx.length === 0) { el.innerHTML = '<div style="color:#6b5b52">Belum ada transaksi</div>'; return; }
  tx.forEach(t=>{
    const d = document.createElement('div'); d.className = 'txn';
    d.innerHTML = `<div style="display:flex;justify-content:space-between"><strong>${t.id}</strong><small>${new Date(t.time).toLocaleString()}</small></div>
      <div style="margin-top:8px">${t.items.map(i=>{ const p = PRODUCTS.find(x=>x.id===i.id); return `${p.name} x${i.qty} = ${rupiah(p.price * i.qty)}` }).join('<br>')}</div>
      <div style="margin-top:8px"><strong>Total: ${rupiah(t.total)}</strong></div>`;
    el.appendChild(d);
  });
}

/* init */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  if(document.getElementById('menuGrid')) renderMenu('all');
  if(document.getElementById('detailCard')) initDetailPage();
  if(document.getElementById('cartList')) renderCartPage();
});
