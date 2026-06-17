/**
 * TravelGo - Premium Production Web Interaction Engine
 * Features: Live Catalog Filtering, Multi-Item Cart Math, Traveler Dropdowns,
 * Image Modals, Scroll Animations, Session Auto-Fill, Live Add-on Calculations,
 * Real-time Instant Booking Modals, Auth State Synchronization, and Dashboard Syncing.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Core structural initializations
    initSearchFilters();
    initTravelerDropdowns();
    initImageModal();
    initBackToTop();

    // Advanced features: Seamless Booking Flows, Auth Linkage & History Syncing
    initBookingTriggers();
    initFormPersistence();
    initAuthObserver();
    renderProfileHistory();
});

/* ==========================================================================
   1. LIVE SEARCH & FILTER ENGINE
   ========================================================================== */
function initSearchFilters() {
    const searchForms = document.querySelectorAll('form[class*="search-form"], .filter-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const destinationInput = form.querySelector('input[placeholder*="Where"], input[placeholder*="City"], input[type="text"]');
            const query = destinationInput ? destinationInput.value.toLowerCase().trim() : '';
            const cards = document.querySelectorAll('.destination-card, .package-card, .hotel-card, .flight-card');
            
            cards.forEach(card => {
                const textContent = card.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   2. INSTANT REAL-WORLD BOOKING MODAL ENGINE
   ========================================================================== */
function initBookingTriggers() {
    const buyButtons = document.querySelectorAll('.book-btn, .hotel-btn, .flight-btn, .package-card button, .hero-btn');

    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const parentCard = button.closest('.destination-card, .package-card, .hotel-card, .flight-card, .hero-content, .history-item');
            if (!parentCard) return;

            const title = parentCard.querySelector('h3, h1, h4') ? parentCard.querySelector('h3, h1, h4').innerText : 'Premium Travel Experience';
            const priceText = parentCard.querySelector('h4, .price') ? parentCard.querySelector('h4, .price').innerText : '$1,249'; 
            const imgElement = parentCard.querySelector('img');
            const imgSrc = imgElement ? imgElement.getAttribute('src') : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=cover';

            const basePrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 1249;

            const activeBooking = {
                title: title,
                price: basePrice,
                image: imgSrc,
                passengers: 1,
                addons: { insurance: false, shuttle: false }
            };

            openRealWorldBookingModal(activeBooking);
        });
    });
}

function openRealWorldBookingModal(item) {
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'active-booking-modal';
    modalOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(5,8,20,0.6); backdrop-filter:blur(20px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; overflow-y:auto; font-family:sans-serif;';

    modalOverlay.innerHTML = `
        <div style="background:linear-gradient(145deg, #0f172a, #1e293b); border:1px solid rgba(255,255,255,0.08); padding:30px; border-radius:24px; max-width:650px; width:100%; box-shadow:0 25px 70px rgba(0,0,0,0.8); position:relative; animation:fadeUp 0.3s ease; max-height:90vh; overflow-y:auto; box-sizing:border-box;">
            <button id="modal-close-btn" style="position:absolute; top:20px; right:20px; background:transparent; border:none; color:#94a3b8; font-size:24px; cursor:pointer; font-weight:bold;">&times;</button>
            
            <div style="display:flex; gap:20px; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:20px; margin-bottom:20px; text-align:left;">
                <img src="${item.image}" style="width:80px; height:80px; object-fit:cover; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                <div>
                    <span style="font-size:11px; text-transform:uppercase; color:#60a5fa; font-weight:700; letter-spacing:1px;">You Are Booking:</span>
                    <h3 style="margin:4px 0 0 0; color:#fff; font-size:20px; font-weight:700;">${item.title}</h3>
                    <p style="margin:2px 0 0 0; font-size:14px; color:#94a3b8;">Base Price: $${item.price.toLocaleString()} per ticket</p>
                </div>
            </div>

            <form id="modal-checkout-form" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; text-align:left;">
                <div style="display:flex; flex-direction:column; gap:15px;">
                    <div>
                        <label style="display:block; color:#fff; font-size:13px; font-weight:600; margin-bottom:6px;">Number of Passengers / Tickets:</label>
                        <select id="modal-passengers" style="width:100%; padding:10px; background:#1e293b; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-weight:600; cursor:pointer; outline:none;">
                            <option value="1">1 Passenger</option>
                            <option value="2">2 Passengers</option>
                            <option value="3">3 Passengers</option>
                            <option value="4">4 Passengers</option>
                            <option value="5">5 Passengers</option>
                        </select>
                    </div>

                    <div>
                        <p style="font-size:13px; font-weight:600; color:#fff; margin:0 0 8px 0;">Optional Add-ons:</p>
                        <label style="display:flex; align-items:center; gap:10px; font-size:12px; color:#94a3b8; margin-bottom:8px; cursor:pointer;">
                            <input type="checkbox" id="modal-ins" style="width:auto; cursor:pointer;"> Full Travel Insurance (+$50 / person)
                        </label>
                        <label style="display:flex; align-items:center; gap:10px; font-size:12px; color:#94a3b8; cursor:pointer;">
                            <input type="checkbox" id="modal-shuttle" style="width:auto; cursor:pointer;"> Airport Shuttle Pickup (+$30 flat)
                        </label>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px; border-left:1px solid rgba(255,255,255,0.08); padding-left:20px;">
                    <p style="font-size:13px; font-weight:600; color:#fff; margin:0;">Secure Checkout:</p>
                    <input type="text" placeholder="Cardholder Full Name" required style="width:100%; padding:10px; background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-size:13px; box-sizing:border-box;">
                    <input type="text" id="modal-card-num" placeholder="0000 0000 0000 0000" required style="width:100%; padding:10px; background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-size:13px; box-sizing:border-box;">
                    
                    <div style="display:flex; gap:10px;">
                        <input type="text" placeholder="MM/YY" required style="width:50%; padding:10px; background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-size:13px; text-align:center; box-sizing:border-box;">
                        <input type="password" placeholder="CVV" required maxLength="3" style="width:50%; padding:10px; background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-size:13px; text-align:center; box-sizing:border-box;">
                    </div>
                </div>

                <div style="grid-column: span 2; background:rgba(0,0,0,0.15); border:1px solid rgba(255,255,255,0.04); padding:15px; border-radius:14px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <p style="margin:0; font-size:12px; color:#94a3b8;">Subtotal: <span id="m-subtotal" style="color:#fff; font-weight:600;">$0</span> | Fee (5%): <span id="m-fee" style="color:#fff; font-weight:600;">$0</span></p>
                        <h2 id="m-grandtotal" style="margin:3px 0 0 0; color:#60a5fa; font-size:22px; font-weight:800;">Total: $0</h2>
                    </div>
                    <button type="submit" style="padding:14px 28px; background:linear-gradient(135deg, #2563eb, #1d4ed8); color:#fff; border:none; border-radius:12px; font-weight:700; cursor:pointer; font-size:14px; box-shadow:0 4px 15px rgba(37,99,235,0.3);">
                        Authorize Payment & Book
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const pSelect = document.getElementById('modal-passengers');
    const insCheck = document.getElementById('modal-ins');
    const shuttleCheck = document.getElementById('modal-shuttle');
    const cardNumInput = document.getElementById('modal-card-num');

    const recalculateTotals = () => {
        item.passengers = parseInt(pSelect.value) || 1;
        item.addons.insurance = insCheck.checked;
        item.addons.shuttle = shuttleCheck.checked;

        let subtotal = item.price * item.passengers;
        if (item.addons.insurance) subtotal += (50 * item.passengers);
        if (item.addons.shuttle) subtotal += 30;

        const fee = subtotal * 0.05;
        const grandTotal = subtotal + fee;

        document.getElementById('m-subtotal').innerText = `$${subtotal.toLocaleString()}`;
        document.getElementById('m-fee').innerText = `$${fee.toLocaleString()}`;
        document.getElementById('m-grandtotal').innerText = `Total: $${grandTotal.toLocaleString()}`;
        
        item.computedTotal = grandTotal; 
    };

    pSelect.addEventListener('change', recalculateTotals);
    insCheck.addEventListener('change', recalculateTotals);
    shuttleCheck.addEventListener('change', recalculateTotals);
    recalculateTotals(); 

    cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
        let matches = val.match(/\d{4,16}/g);
        let match = (matches && matches[0]) || '';
        let parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) { parts.push(match.substring(i, i + 4)); }
        e.target.value = parts.length > 0 ? parts.join(' ') : val;
    });

    document.getElementById('modal-close-btn').addEventListener('click', () => modalOverlay.remove());
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.remove(); });

    document.getElementById('modal-checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();

        item.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        item.id = 'TRV-' + Math.floor(100000 + Math.random() * 900000);

        // Append item directly into unauthenticated guest storage cache
        const currentHistory = JSON.parse(localStorage.getItem('travelHistory') || '[]');
        currentHistory.unshift(item);
        localStorage.setItem('travelHistory', JSON.stringify(currentHistory));

        modalOverlay.remove();
        showSuccessModal(item);
    });
}

function showSuccessModal(item) {
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(5,8,20,0.95); backdrop-filter:blur(15px); z-index:999999; display:flex; align-items:center; justify-content:center; animation:fadeUp 0.4s ease; font-family:sans-serif;';

    modalOverlay.innerHTML = `
        <div style="background:linear-gradient(145deg, #111a2e, #0f172a); border:1px solid rgba(255,255,255,0.08); padding:40px; border-radius:24px; max-width:500px; width:90%; text-align:center; box-shadow:0 25px 70px rgba(0,0,0,0.7);">
            <div style="width:70px; height:70px; background:rgba(16,185,129,0.1); border:2px solid #10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
                <span style="color:#10b981; font-size:35px; font-weight:bold;">&checkmark;</span>
            </div>
            <h2 style="color:#fff; font-size:26px; font-weight:700; margin-bottom:10px;">Booking Successful!</h2>
            <p style="color:#94a3b8; font-size:14px; margin-bottom:25px;">Your transaction was authorized successfully. Reference Tracking ID: <strong style="color:#60a5fa;">${item.id}</strong>.</p>
            
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:left; margin-bottom:25px;">
                <p style="margin:0 0 5px 0; font-size:12px; color:#94a3b8;">Destination: <span style="color:#fff; font-weight:600;">${item.title}</span></p>
                <p style="margin:0 0 5px 0; font-size:12px; color:#94a3b8;">Total Tickets: <span style="color:#fff; font-weight:600;">${item.passengers} Ticket(s)</span></p>
                <p style="margin:0; font-size:12px; color:#94a3b8;">Total Charged: <span style="color:#60a5fa; font-weight:700;">$${item.computedTotal.toLocaleString()}</span></p>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
                <button id="btn-download-receipt" style="padding:14px; background:linear-gradient(135deg, #3b82f6, #1d4ed8); color:#fff; border:none; border-radius:12px; font-weight:600; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; gap:8px;">
                    📥 Download Booking Receipt (.txt)
                </button>
                <button id="btn-close-success" style="padding:12px; background:transparent; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:12px; font-weight:500; cursor:pointer; font-size:13px;">
                    Sign In to Sync with Dashboard
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById('btn-download-receipt').addEventListener('click', () => {
        const receiptContent = `
==================================================
              TRAVELGO BOOKING RECEIPT            
==================================================
Booking Reference ID : ${item.id}
Transaction Date     : ${item.date}
Payment Status       : CONFIRMED & AUTHORIZED
--------------------------------------------------
Itinerary Details    : ${item.title}
Total Tickets/Pass   : ${item.passengers}
Insurance Protection : ${item.addons.insurance ? 'Yes' : 'No'}
Airport Shuttle Bus  : ${item.addons.shuttle ? 'Yes' : 'No'}
--------------------------------------------------
GRAND TOTAL PAID     : $${item.computedTotal.toLocaleString()}
==================================================
Thank you for booking with TravelGo Premium Systems.
        `.trim();

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt-${item.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    document.getElementById('btn-close-success').addEventListener('click', () => {
        modalOverlay.remove();
        // Route directly to your login or profile configuration view
        window.location.href = 'login.html';
    });
}

/* ==========================================================================
   3. AUTH STATE SYNCHRONIZATION AND ROUTING SYSTEM (NEW)
   ========================================================================== */
function initAuthObserver() {

    const signupForm = document.querySelector('.signup-form');
    const loginForm = document.querySelector('.login-form');

    // SIGNUP
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = signupForm.querySelectorAll('input');

            const fullName = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const password = inputs[2].value;

            const users = JSON.parse(localStorage.getItem('users') || '{}');

            users[email] = {
                name: fullName,
                email: email,
                password: password
            };

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', email);

            if (!localStorage.getItem(`history_${email}`)) {
                localStorage.setItem(`history_${email}`, '[]');
            }

            window.location.href = 'profile.html';
        });
    }

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = loginForm.querySelectorAll('input');

            const email = inputs[0].value.trim();
            const password = inputs[1].value;

            const users = JSON.parse(localStorage.getItem('users') || '{}');

            if (!users[email]) {
                alert('Account not found');
                return;
            }

            if (users[email].password !== password) {
                alert('Wrong password');
                return;
            }

            localStorage.setItem('currentUser', email);

            window.location.href = 'profile.html';
        });
    }
}

/* ==========================================================================
   4. MOCK PROFILE & DYNAMIC INVOICE DASHBOARD SYNCING (UPDATED)
   ========================================================================== */
function renderProfileHistory() {
    const historyBox = document.querySelector('.travel-history-box, .profile-workspace, #dashboard-history');
    if (!historyBox) return;

    // Detect if an authenticated user profile identity exists
    const currentUser = localStorage.getItem('currentUser') || 'Guest Explorer';
    
    // Attempt lookup against specific user key, fallback directly into baseline unassigned store values
    let historyData = JSON.parse(localStorage.getItem(`history_${currentUser}`) || '[]');
    if (!historyData || historyData.length === 0) {
        historyData = JSON.parse(localStorage.getItem('travelHistory') || '[]');
    }

    // Dynamic injection label configurations
    let listingContainer = historyBox.querySelector('.history-list');
    if (!listingContainer) {
        listingContainer = document.createElement('div');
        listingContainer.className = 'history-list';
        listingContainer.style.cssText = 'display:flex; flex-direction:column; gap:15px; margin-top:20px;';
        historyBox.appendChild(listingContainer);
    }

    // Render user profile heading tags dynamically if matching block is found
    const welcomeHeader = document.querySelector('.welcome-user, #profile-title');
    if (welcomeHeader) {
        welcomeHeader.innerText = `Welcome Back, ${currentUser.split('@')[0]}`;
    }

    if (historyData.length === 0) {
        listingContainer.innerHTML = `<p style="color:var(--muted); font-size:14px; text-align:center; padding:20px;">No historical booking instances connected to this account profile.</p>`;
        return;
    }

    listingContainer.innerHTML = ''; 
    
    historyData.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'history-item';
        itemRow.style.cssText = 'display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:20px; padding:20px; border-radius:14px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02);';
        
        itemRow.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; text-align:left;">
                <img src="${item.image}" style="width:55px; height:55px; object-fit:cover; border-radius:8px;">
                <div>
                    <h4 style="margin:0; font-size:15px; color:#fff; font-weight:600;">${item.title}</h4>
                    <p style="margin:3px 0 0 0; font-size:12px; color:#94a3b8;">Reference: ${item.id} | Date: ${item.date} | Tickets: ${item.passengers}</p>
                </div>
            </div>
            <div style="text-align:right;">
                <span style="display:block; font-weight:700; color:#3b82f6; font-size:16px;">$${item.computedTotal.toLocaleString()}</span>
                <span style="font-size:11px; padding:3px 8px; border-radius:20px; background:rgba(16,185,129,0.1); color:#10b981; font-weight:600;">Active & Synced</span>
            </div>
        `;
        listingContainer.appendChild(itemRow);
    });
}

/* ==========================================================================
   5. PERSISTENT FORM AUTO-FILL ENGINE
   ========================================================================== */
function initFormPersistence() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.className.includes('search') || form.className.includes('filter') || form.id === 'modal-checkout-form') return;

        const storageKey = `form_cache_${window.location.pathname}`;
        const cachedData = localStorage.getItem(storageKey);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            Object.keys(parsed).forEach(name => {
                const input = form.querySelector(`[name="${name}"], input[type="text"], input[type="email"]`);
                if (input && parsed[name]) input.value = parsed[name];
            });
        }

        form.addEventListener('input', () => {
            const data = {};
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach((input, index) => {
                const key = input.getAttribute('name') || input.getAttribute('placeholder') || `input_${index}`;
                if (input.type !== 'password') data[key] = input.value;
            });
            localStorage.setItem(storageKey, JSON.stringify(data));
        });
    });
}

/* ==========================================================================
   6. USER EXPERIENCE COMPONENT UTILITIES
   ========================================================================== */
function initTravelerDropdowns() {
    const travelerBox = document.querySelector('.traveler-box');
    const travelerPopup = document.querySelector('.traveler-popup');
    if (!travelerBox || !travelerPopup) return;

    travelerBox.addEventListener('click', (e) => {
        e.stopPropagation();
        travelerPopup.style.display = travelerPopup.style.display === 'block' ? 'none' : 'block';
    });

    const choices = document.querySelectorAll('.traveler-option');
    choices.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            travelerBox.innerText = option.innerText;
            travelerPopup.style.display = 'none';
        });
    });

    document.addEventListener('click', () => { travelerPopup.style.display = 'none'; });
}

function initImageModal() {
    const modal = document.querySelector('.img-modal');
    const modalImg = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.img-modal .close');
    if (!modal || !modalImg) return;

    const gridImages = document.querySelectorAll('.destination-card img, .package-card img, .hotel-card img');
    gridImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = img.src;
        });
    });

    const closeModal = () => { modal.style.display = "none"; };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

function initBackToTop() {
    const topButton = document.querySelector('.back-to-top');
    if (!topButton) return;

    window.addEventListener('scroll', () => {
        topButton.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    topButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        const profileName = document.getElementById("profile-name");
        const avatar = document.getElementById("profile-avatar");

        if (profileName) {
            profileName.textContent = currentUser.split("@")[0];
        }

        if (avatar) {
            const initials = currentUser
                .split("@")[0]
                .split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase();

            avatar.textContent = initials || "U";
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[currentUser];

    if (!user) return;

    // Profile Name
    const profileName = document.getElementById("profile-name");
    if (profileName) {
        profileName.textContent = user.name;
    }

    // Avatar
    const avatar = document.getElementById("profile-avatar");
    if (avatar) {
        const initials = user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

        avatar.textContent = initials;
    }

    // Replace Rahul email
    const emailBoxes = document.querySelectorAll("div");

    emailBoxes.forEach(box => {
        if (box.textContent.includes("rahul.sharma@example.com")) {
            box.textContent = user.email;
        }
    });
});
