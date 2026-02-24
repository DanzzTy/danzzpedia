let selectedItemData = null;
       let currentGame = 'ff';
       let promoDiscount = 0;
       let promoApplied = false; // anti-spam sederhana
       const promoCodeValid = 'DANZZGANTENG';

       function selectGame(game) {
           currentGame = game;
           document.querySelectorAll('.game-card').forEach(card => card.classList.remove('selected'));
           document.getElementById(`game-${game}`).classList.add('selected');

           let gameName = game === 'ff' ? 'Verifikasi ASTUTE' : game === 'ml' ? 'VIP ANDRO' : 'VIP iOS';
           document.getElementById('summaryGame').textContent = gameName;
           document.getElementById('idTitle').textContent = `Masukkan ID ${gameName}`;
           document.getElementById('idHint').textContent = `ID bisa dilihat di pengaturan in game untuk membeli ${gameName}`;

           document.getElementById('ffSection').style.display = game === 'ff' ? 'block' : 'none';
           document.getElementById('mlSection').style.display = game === 'ml' ? 'block' : 'none';
           document.getElementById('fcSection').style.display = game === 'fc' ? 'block' : 'none';

           selectedItemData = null;
           promoDiscount = 0;
           promoApplied = false;
           document.getElementById('orderBar').classList.remove('show');
           document.getElementById('selectedItem').textContent = '-';
           document.getElementById('priceDisplay').innerHTML = '<span class="text-orange-600 font-bold text-xl">Rp 0</span>';
           document.querySelectorAll('.verif-card').forEach(card => card.classList.remove('selected'));
           document.getElementById('promoCode').value = '';
           document.getElementById('promoRow').classList.add('hidden');

           updateSummary();
       }

       function selectItem(element, name, price) {
           document.querySelectorAll('.verif-card').forEach(card => card.classList.remove('selected'));
           element.classList.add('selected');

           selectedItemData = { name, originalPrice: price, price: price };

           document.getElementById('selectedItem').textContent = name;
           updatePriceDisplay();
           document.getElementById('orderBar').classList.add('show');

           // Reset promo kalau ganti paket
           if (promoApplied) {
               promoApplied = false;
               promoDiscount = 0;
               selectedItemData.price = price;
               document.getElementById('promoCode').value = '';
               document.getElementById('promoRow').classList.add('hidden');
           }

           updateSummary();
       }

       function updatePriceDisplay() {
           const display = document.getElementById('priceDisplay');
           const finalPrice = selectedItemData ? selectedItemData.price : 0;

           if (promoDiscount > 0) {
               display.innerHTML = `
                   <span class="price-original text-sm">Rp ${selectedItemData.originalPrice.toLocaleString('id-ID')}</span>
                   <span class="price-discount">Rp ${finalPrice.toLocaleString('id-ID')}</span>
               `;
           } else {
               display.innerHTML = `<span class="text-orange-600 font-bold text-xl">Rp ${finalPrice.toLocaleString('id-ID')}</span>`;
           }
       }

       function applyPromo() {
           if (promoApplied) {
               showToast('Info', 'Promo sudah diterapkan');
               return;
           }

           const code = document.getElementById('promoCode').value.trim().toUpperCase();

           if (code === promoCodeValid && selectedItemData) {
               promoDiscount = selectedItemData.originalPrice * 0.10;
               selectedItemData.price = selectedItemData.originalPrice - promoDiscount;
               promoApplied = true;

               showToast('Sukses', 'Kode DANZZGANTENG diterapkan! Diskon 10%');
               updatePriceDisplay();

               document.getElementById('promoDiscount').textContent = `- Rp ${promoDiscount.toLocaleString('id-ID')}`;
               document.getElementById('promoRow').classList.remove('hidden');
               updateSummary();
           } else {
               showToast('Gagal', 'Kode promo tidak valid atau belum pilih paket');
           }
       }

       function updateSummary() {
           if (!selectedItemData) {
               document.getElementById('summarySection').classList.add('hidden');
               return;
           }

           document.getElementById('summaryProduct').textContent = selectedItemData.name;
           document.getElementById('summaryId').textContent = document.getElementById('userId').value.trim() || '-';
           document.getElementById('summaryTotal').textContent = selectedItemData.price.toLocaleString('id-ID');

           if (promoDiscount > 0) {
               document.getElementById('promoRow').classList.remove('hidden');
           } else {
               document.getElementById('promoRow').classList.add('hidden');
           }

           document.getElementById('summarySection').classList.remove('hidden');
       }

       function processOrder() {
           const userId = document.getElementById('userId').value.trim();

           if (!userId) {
               showToast('ID Kosong', 'Silakan masukkan ID akun');
               return;
           }

           if (!selectedItemData) {
               showToast('Belum Pilih Paket', 'Silakan pilih paket terlebih dahulu');
               return;
           }

           let gameName = currentGame === 'ff' ? 'Free Fire (Verif ASTUTE)' :
                          currentGame === 'ml' ? 'VIP ANDRO' : 'VIP iOS';

           let promoText = promoDiscount > 0 ?
               `Kode Promo    : ADENGACOR (diskon 10%)\n` : '';

           let message = `🛒 PESANAN BARU - DANZZ PEDIA\n\n` +
                         `Game          : ${gameName}\n` +
                         `Produk        : ${selectedItemData.name}\n` +
                         `ID Akun       : ${userId}\n` +
                         promoText +
                         `Total Bayar   : Rp ${selectedItemData.price.toLocaleString('id-ID')}\n\n` +
                         `Silakan konfirmasi pembayaran ya Min 🙏\n` +
                         `Terima kasih banyak! 🔥`;

           const whatsappUsername = 'danzzastute';
           const whatsappLink = `https://wa.me/${telegramUsername}?text=${encodeURIComponent(message)}`;

           window.open(whatsappLink, '_blank');
       }

       function showToast(title, message) {
           document.getElementById('toastTitle').textContent = title;
           document.getElementById('toastMessage').textContent = message;
           const toast = document.getElementById('toast');
           toast.classList.add('show');
           setTimeout(() => toast.classList.remove('show'), 3000);
       }

       document.getElementById('userId').addEventListener('input', function(e) {
           this.value = this.value.replace(/[^0-9]/g, '');
           updateSummary();
       });

       // Init
       selectGame('ff');
