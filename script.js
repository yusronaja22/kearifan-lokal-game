document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const gamePage = document.getElementById('game-page');
    const btnMulai = document.querySelector('.btn-mulai');
    
    // Popup Elements
    const popupFullscreen = document.getElementById('popup-fullscreen');
    const btnYa = document.getElementById('btn-ya');
    const btnTidak = document.getElementById('btn-tidak');
    
    // Header Controls
    const btnMusic = document.getElementById('btn-music');
    const musicIcon = document.getElementById('music-icon');
    const btnFullscreenToggle = document.getElementById('btn-fullscreen-toggle');

    // Page 2 & 3 Elements
    const storyPage = document.getElementById('story-page');
    const mapPage = document.getElementById('map-page');
    const ceritaOverlay = document.getElementById('cerita-overlay');
    const ceritaTitle = document.getElementById('cerita-title');
    const ceritaText = document.getElementById('cerita-text');
    const ceritaKarakter = document.getElementById('cerita-karakter');
    const btnMulaiPetualangan = document.getElementById('btn-mulai-petualangan');
    const audioPembuka = document.getElementById('audio-pembuka');
    const audioPetunjuk = document.getElementById('audio-petunjuk');
    
    // Game Logic Elements & Audio
    const textSkor = document.getElementById('text-skor');
    const audioSfxCorrect = document.getElementById('audio-sfx-correct');
    const audioSfxWrong = document.getElementById('audio-sfx-wrong');
    const audioSfxNotif = document.getElementById('audio-sfx-notif');
    const audioBgmGame = document.getElementById('audio-bgm-game');
    const audioPenutup = document.getElementById('audio-penutup');
    const audioSoal = document.getElementById('audio-soal');
    const audioBenar = document.getElementById('audio-benar');
    
    const endingPage = document.getElementById('ending-page');
    // Refleksi (Textarea removed)
    const btnKeluar = document.getElementById('btn-keluar');
    const btnMainLagi = document.getElementById('btn-main-lagi');

    let isMusicPlaying = true;
    let typeWriterTimeout = null;
    
    const textPembuka = "Halo, teman-teman! Hari ini kita akan bermain Petak Umpet Nusantara. Sambil mencari teman-teman kita yang bersembunyi, kita juga akan belajar mengenal berbagai pakaian adat dari seluruh Indonesia beserta ciri khas dan filosofinya. Yuk, kita mulai petualangannya";
    const textPetunjuk = "Perhatikan petunjuk berupa suara atau tulisan yang muncul untuk mencari tahu pakaian adat dari daerah mana yang sedang bersembunyi! Cari dan Klik ikon di peta yang sesuai dengan petunjuk tersebut. Jawaban yang benar akan menambah skormu!";

    // Show Popup Fullscreen on Mulai click
    btnMulai.addEventListener('click', (e) => {
        e.preventDefault();
        popupFullscreen.classList.remove('hidden');
    });

    // Handle 'Ya' (Fullscreen mode)
    btnYa.addEventListener('click', () => {
        requestFullscreen();
        popupFullscreen.classList.add('hidden');
        startGame();
    });

    // Handle 'Tidak' (Normal mode)
    btnTidak.addEventListener('click', () => {
        popupFullscreen.classList.add('hidden');
        startGame();
    });

    // Toggle Music
    btnMusic.addEventListener('click', () => {
        isMusicPlaying = !isMusicPlaying;
        if (isMusicPlaying) {
            musicIcon.src = 'Asset/images/music-on.svg';
            // Resume music based on current page
            if (!document.getElementById('ending-page').classList.contains('hidden')) {
                audioPenutup.play().catch(e => console.log(e));
            } else if (document.getElementById('landing-page').classList.contains('hidden')) {
                // Berarti sedang di Story Page atau Map Page
                audioBgmGame.play().catch(e => console.log(e));
            }
        } else {
            musicIcon.src = 'Asset/images/music-off.svg';
            // Pause all possible audios
            audioPembuka.pause();
            audioPetunjuk.pause();
            audioBgmGame.pause();
            audioSoal.pause();
            audioBenar.pause();
            audioPenutup.pause();
            audioSfxNotif.pause();
            audioSfxWrong.pause();
            audioSfxCorrect.pause();
        }
    });

    // Toggle Fullscreen
    btnFullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    function requestFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    function typeWriter(text, element, speed = 80) {
        // Hentikan pengetikan sebelumnya jika ada
        if (typeWriterTimeout) {
            clearTimeout(typeWriterTimeout);
        }
        
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                typeWriterTimeout = setTimeout(type, speed);
            }
        }
        type();
    }

    function startGame() {
        landingPage.classList.add('hidden');
        endingPage.classList.add('hidden');
        storyPage.classList.remove('hidden');

        // Ensure popup-end.svg is used for the start of the game
        const popupElement = document.querySelector('.cerita-popup');
        if (popupElement) {
            popupElement.classList.remove('mode-ketemu');
            popupElement.style.backgroundImage = "url('Asset/images/popup-end.svg')";
        }
        
        // Hide character explicitly during story sequence
        if (ceritaKarakter) {
            ceritaKarakter.classList.add('hidden');
        }

        // Reset button text
        btnMulaiPetualangan.innerHTML = "Mulai Petualangan";
        btnMulaiPetualangan.style = ""; // Reset any inline styles if necessary

        // Start Story Sequence
        playStorySequence();
    }

    // --- Carousel Logic for Panduan Permainan ---
    const panduanCarousel = document.getElementById('panduan-carousel');
    const carouselTrack = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = 2;

    function updateCarousel() {
        if (!carouselTrack) return;
        carouselTrack.style.transform = `translateX(-${currentSlide * 50}%)`;
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Atur judul dan audio berdasarkan slide saat ini
        if (currentSlide === 0) {
            ceritaTitle.textContent = "Tujuan Pembelajaran dan Misi";
            if (isMusicPlaying) {
                audioPetunjuk.pause();
                audioPetunjuk.currentTime = 0;
                audioPembuka.play().catch(e => console.log(e));
            }
        } else {
            ceritaTitle.textContent = "Panduan Permainan";
            if (isMusicPlaying) {
                audioPembuka.pause();
                audioPembuka.currentTime = 0;
                if (audioPetunjuk.paused) {
                    audioPetunjuk.play().catch(e => console.log(e));
                }
            }
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { currentSlide = index; updateCarousel(); });
    });

    function playStorySequence() {
        // Hentikan pengetikan jika sedang berjalan
        if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
        
        // Sembunyikan teks cerita biasa, langsung tampilkan carousel
        ceritaText.classList.add('hidden');
        ceritaTitle.classList.remove('hidden');
        
        if (panduanCarousel) {
            panduanCarousel.classList.remove('hidden');
            currentSlide = 0;
            updateCarousel(); // Ini otomatis akan memainkan audioPembuka
        }
        
        // Auto-advance ke petunjuk saat audio pembuka selesai
        audioPembuka.onended = () => {
            if (currentSlide === 0) {
                currentSlide = 1;
                updateCarousel();
            }
        };

        audioPetunjuk.onended = () => {
            console.log("Instruksi selesai dibacakan.");
        };
    }

    // --- GAME STATE ---
    let isGameStarted = false;
    let skor = 0;
    let currentRoundIndex = 0;
    
    const soalList = [
        { id: 'aceh', text: 'Pakaian tradisional dari ujung barat Indonesia, sering dipakai untuk Tari Saman!', target: ['aceh', 'aceh-rumah', 'aceh-ruma'], popText: 'Halo! Aku Cut dari Aceh. Ini pakaian adatku namanya Ulee Balang. Lihat hiasan di kepalaku dan pakaian megah ini? Motif dan keindahannya melambangkan kebesaran, keberanian, serta ketinggian martabat masyarakat Aceh!' },
        { id: 'bali', text: 'Pakaian adat yang dilengkapi Udeng dan kain kamben untuk upacara budaya!', target: ['bali', 'bali-rumah'], popText: 'Halo! Aku Made dari Bali. Ini pakaian adatku, ya. Aku memakai Udeng di kepalaku dan kain Kamben ini. Biasanya kami memakai pakaian ini saat mengikuti upacara budaya di pura sebagai wujud syukur kepada Sang Pencipta!' },
        { id: 'dayak', text: 'Pakaian adat dari suku di pedalaman hutan tropis dengan motif burung enggang!', target: ['dayak', 'dayak-rumah'], popText: 'Hai! Aku Anah dari Kalimantan Timur. Ini baju adatku, namanya Ta\'a. Motif batik dan hiasan manik-manik di bajuku ini melambangkan kekayaan alam hutan kami yang harus selalu kita jaga!' },
        { id: 'jawa', text: 'Pakaian adat dengan blangkon dan kebaya yang anggun!', target: ['jawa', 'jawa-rumah', 'joglo'], popText: 'Halo! Aku Raden dari Jawa Tengah. Kalau kamu melihatku memakai baju Beskap dan Blangkon di kepalaku, berarti aku sedang bersiap untuk acara istimewa. Blangkon ini bukan sekadar topi, tapi simbol kedewasaan dan tanggung jawab bagi laki-laki Jawa.' },
        { id: 'papua', text: 'Pakaian adat berupa rok rumbai dari serat daun sagu kering dan mahkota burung cendrawasih!', target: ['papua', 'papua-rumah', 'honai'], popText: 'Halo! Aku Osea dari Papua. Pakaian ini adalah rok rumbai dari serat daun sagu. Dan lihat mahkota di kepalaku? Ini dibuat dari bulu burung cendrawasih yang melambangkan keindahan alam tanah Papua yang kami sayangi!' },
        { id: 'toraja', text: 'Pakaian adat dari daerah yang terkenal dengan rumah Tongkonan!', target: ['toraja', 'toraja-rumah'], popText: 'Halo! Aku Rukka dari Toraja. Lihat pakaian adatku ini, namanya Baju Pokko. Warnanya yang cerah dan pola manik-manik ini melambangkan kegembiraan dan hubungan baik kami dengan Sang Pencipta serta alam sekitar.' }
    ];

    // Acak urutan soal
    soalList.sort(() => Math.random() - 0.5);


    
    function updateHudSkor() {
        const skorIcons = document.querySelectorAll('#skor-icons .skor-icon');
        for (let i = 0; i < skorIcons.length; i++) {
            if (i < skor) {
                skorIcons[i].src = 'Asset/images/ketemu.svg';
                skorIcons[i].classList.add('muncul-animasi-samping'); // Tambahkan efek
            } else {
                skorIcons[i].src = 'Asset/images/sembunyi.svg';
                skorIcons[i].classList.remove('muncul-animasi-samping');
            }
        }
    }

    function fadeAudioVolume(audioElement, targetVolume, duration = 500) {
        if (audioElement.fadeInterval) {
            clearInterval(audioElement.fadeInterval);
        }
        const startVolume = audioElement.volume;
        const volumeDiff = targetVolume - startVolume;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = volumeDiff / steps;
        
        let currentStep = 0;
        audioElement.fadeInterval = setInterval(() => {
            currentStep++;
            let newVolume = startVolume + (volumeStep * currentStep);
            if (newVolume > 1) newVolume = 1;
            if (newVolume < 0) newVolume = 0;
            audioElement.volume = newVolume;
            
            if (currentStep >= steps) {
                audioElement.volume = targetVolume;
                clearInterval(audioElement.fadeInterval);
                audioElement.fadeInterval = null;
            }
        }, stepTime);
    }

    function playNextSoal() {
        if (currentRoundIndex >= soalList.length) {
            winGame();
            return;
        }
        const currentSoal = soalList[currentRoundIndex];
        
        // Update teks soal di wadah soal pojok kiri bawah
        const textSoalDisplay = document.getElementById('text-soal-display');
        if(textSoalDisplay) {
            textSoalDisplay.textContent = currentSoal.text;
        }
        
        if (isMusicPlaying) {
            audioSfxNotif.play();
            audioSfxNotif.onended = () => {
                audioSoal.src = `Asset/audio/soal-${currentSoal.id}.mp3`;
                fadeAudioVolume(audioBgmGame, 0.2, 500); // Turunkan BGM menjadi 20%
                audioSoal.play();
                audioSoal.onended = () => {
                    fadeAudioVolume(audioBgmGame, 1.0, 500); // Naikkan BGM menjadi 100%
                };
            };
        }
    }

    function winGame() {
        audioBgmGame.pause();
        audioBgmGame.currentTime = 0;
        
        // Play voice over penutup
        if (isMusicPlaying) {
            audioPenutup.currentTime = 0;
            audioPenutup.play().catch(e => console.log("Audio play failed:", e));
        }

        mapPage.classList.add('hidden');
        endingPage.classList.remove('hidden');
    }



    // Handle Button Click (Mulai / Lanjut)
    btnMulaiPetualangan.addEventListener('click', () => {
        // Hentikan pengetikan cerita pembuka jika pengguna skip (klik Mulai Petualangan) sebelum selesai
        if (typeWriterTimeout) {
            clearTimeout(typeWriterTimeout);
        }

        if (!isGameStarted) {
            isGameStarted = true;
            storyPage.classList.add('hidden');
            mapPage.classList.remove('hidden');
            
            audioPembuka.pause();
            audioPembuka.currentTime = 0;
            audioPembuka.onended = null;
            
            audioPetunjuk.pause(); 
            audioPetunjuk.currentTime = 0; 
            
            // Siapkan UI untuk pop-up berikutnya
            mapPage.appendChild(ceritaOverlay);
            ceritaOverlay.classList.add('hidden');
            btnMulaiPetualangan.textContent = "Lanjut";

            updateHudSkor();
            if(isMusicPlaying) audioBgmGame.play();
            playNextSoal();
            
            console.log("Petualangan dimulai!");
        } else {
            // Logika tombol "Lanjut" setelah jawaban benar
            ceritaOverlay.classList.add('hidden');
            audioBenar.pause();
            audioBenar.currentTime = 0;
            audioBenar.onended = null;
            fadeAudioVolume(audioBgmGame, 1.0, 100); // Cepat naikkan BGM kembali jika di-skip
            
            currentRoundIndex++;
            playNextSoal();
        }
    });

    // Handle Ending Page logic
    btnKeluar.addEventListener('click', () => {
        audioPenutup.pause();
        alert("Terima kasih telah bermain Petak Umpet Nusantara!");
        location.reload();
    });
    btnMainLagi.addEventListener('click', () => {
        audioPenutup.pause();
        location.reload();
    });

    // --- MAP LOGIC ---
    const mapWrap = document.getElementById('map-wrap');
    let svgMap = null;

    let scale = 1;
    let x = 0;
    let y = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startMapX = 0;
    let startMapY = 0;
    let moved = false;
    const DRAG_THRESHOLD = 5;

    // Load SVG Map
    function loadMap() {
        fetch('Asset/images/map-dan-ikon-colored.svg')
            .then(response => response.text())
            .then(svgText => {
                mapWrap.innerHTML = svgText;
                svgMap = mapWrap.querySelector('svg');
                if(svgMap) {
                    initMapInteractive();
                }
            })
            .catch(err => console.error("Failed to load map:", err));
    }

    let renderMapRAF = null;

    function renderMap() {
        if(!svgMap) return;
        
        // Batasi zoom out (kembali ke tampilan awal penuh jika scale <= 1)
        if (scale <= 1.0) {
            scale = 1.0;
            x = 0;
            y = 0;
        } else {
            // Constrain / Batasi panning agar gambar peta tidak bisa ditarik ke luar layar
            const wrapRect = mapWrap.getBoundingClientRect();
            const minX = wrapRect.width * (1 - scale);
            const minY = wrapRect.height * (1 - scale);
            
            if (x > 0) x = 0;
            if (x < minX) x = minX;
            if (y > 0) y = 0;
            if (y < minY) y = minY;
        }

        // Gunakan translate3d untuk akselerasi GPU (hardware acceleration) agar tidak berat
        svgMap.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    function scheduleRender() {
        if (renderMapRAF) cancelAnimationFrame(renderMapRAF);
        renderMapRAF = requestAnimationFrame(renderMap);
    }

    function zoomAt(zoomMultiplier, centerX, centerY) {
        if(!svgMap) return;
        const wrapRect = mapWrap.getBoundingClientRect();
        
        let newScale = scale * zoomMultiplier;
        newScale = Math.min(Math.max(0.2, newScale), 8);
        const actualMultiplier = newScale / scale;

        // Gunakan koordinat logis untuk menghindari bug saat transisi CSS berlangsung
        const mx = centerX - wrapRect.left;
        const my = centerY - wrapRect.top;

        x = mx - (mx - x) * actualMultiplier;
        y = my - (my - y) * actualMultiplier;
        scale = newScale;

        scheduleRender();
    }

    function initMapInteractive() {
        // Optimasi Render SVG
        svgMap.style.transformOrigin = '0 0'; // Wajib 0 0 untuk perhitungan zoom logis
        svgMap.style.willChange = 'transform';
        svgMap.style.backfaceVisibility = 'hidden';

        // Setup clickable areas berdasarkan ID atau label dari SVG
        const clickableLabels = [
            'aceh-rumah','aceh-ruma','aceh-masjid','g79','g77','g80','g78','gn-ac','ph-su',
            'gajah','joglo','jawa-rumah','g90','g88','g31','g28','g89','orang-utan','dayak',
            'dayak-rumah','g95','ph-d-2','g96','g59','g56','toraja','toraja-rumah','bird-2',
            'g49','g50','g46','g48','bali','bali-rumah','g93','g39','honai','papua-rumah',
            'g99','g98','bird-1','cend-1','g101','g71','g69','g68',
            'aceh-karakter','jawa-karakter','bali-karakter','toraja-karakter','dayak-karakter','papua-karakter'
        ];

        clickableLabels.forEach(name => {
            svgMap.querySelectorAll(`[id="${name}"]`).forEach(el => el.classList.add('map-clickable'));
            svgMap.querySelectorAll(`[inkscape\\:label="${name}"]`).forEach(el => el.classList.add('map-clickable'));
        });

        // Click Event
        svgMap.addEventListener('click', (event) => {
            if(moved) return;

            let target = event.target;
            while(target && target !== svgMap) {
                if(target.classList && target.classList.contains('map-clickable')) {
                    break;
                }
                target = target.parentElement;
            }

            if(!target || target === svgMap) return;

            svgMap.querySelectorAll('.map-clickable.selected').forEach(el => el.classList.remove('selected'));
            target.classList.add('selected');
            
            const targetId = (target.getAttribute('inkscape:label') || target.getAttribute('id') || '').toLowerCase();
            console.log('Clicked target:', targetId);

            // Validasi Game Logic
            if(currentRoundIndex >= soalList.length) return;
            
            const currentSoal = soalList[currentRoundIndex];
            audioSoal.pause(); // Hentikan audio soal jika masih bermain
            
            if(currentSoal.target.includes(targetId) || currentSoal.target.includes(targetId.replace('-ruma', '-rumah'))) {
                // BENAR
                audioSfxCorrect.play().catch(e => console.log(e));
                skor++;
                updateHudSkor();
                
                // Munculkan ikon anak di atas elemen yang diklik (di dalam SVG)
                try {
                    let anchorElement = target;
                    // Selalu gunakan rumah sebagai patokan ukuran dan posisi
                    const rumahLabel = currentSoal.id + '-rumah';
                    const rumahEl = svgMap.querySelector(`[id="${rumahLabel}"]`) || svgMap.querySelector(`[inkscape\\:label="${rumahLabel}"]`);
                    if (rumahEl) {
                        anchorElement = rumahEl;
                    }

                    const bbox = anchorElement.getBBox();
                    
                    // Buat wrapper group untuk menahan transform SVG ikon agar tidak tertimpa animasi CSS
                    const wrapperGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    const transform = anchorElement.getAttribute('transform');
                    if (transform) {
                        wrapperGroup.setAttribute('transform', transform);
                    }
                    
                    const childIcon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    childIcon.setAttribute('href', `Asset/images/ikon-${currentSoal.id}.png`);
                    childIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `Asset/images/ikon-${currentSoal.id}.png`);
                    
                    // Posisi akhir ikon: Di samping kanan rumah
                    const iconWidth = Math.max(bbox.width * 1.5, 60); 
                    const iconHeight = iconWidth;
                    childIcon.setAttribute('x', bbox.x + bbox.width - (iconWidth * 0.3)); // Mengintip dari kanan
                    childIcon.setAttribute('y', bbox.y + (bbox.height / 2) - (iconHeight / 2)); // Vertikal di tengah
                    childIcon.setAttribute('width', iconWidth);
                    childIcon.setAttribute('height', iconHeight);
                    
                    childIcon.classList.add('muncul-animasi-samping'); // Animasi pop up ke samping
                    wrapperGroup.appendChild(childIcon);
                    
                    // Sisipkan ikon TEPAT DI BELAKANG rumah
                    if(anchorElement.parentNode) {
                        anchorElement.parentNode.insertBefore(wrapperGroup, anchorElement);
                    } else {
                        svgMap.insertBefore(wrapperGroup, svgMap.firstChild);
                    }
                } catch(e) {
                    console.error("Gagal menaruh ikon:", e);
                }
                
                setTimeout(() => {
                    ceritaOverlay.classList.remove('hidden');
                    
                    // Ganti background popup ke popup-ketemu.svg
                    const popupElement = document.querySelector('.cerita-popup');
                    if (popupElement) {
                        popupElement.classList.add('mode-ketemu');
                        popupElement.style.backgroundImage = ""; // Let CSS handle it
                    }
                    
                    ceritaKarakter.src = `Asset/images/pop-${currentSoal.id}.png`;
                    ceritaKarakter.classList.remove('hidden'); // Show character
                    ceritaTitle.classList.remove('hidden');
                    ceritaTitle.textContent = "Berhasil!";
                    
                    // Sembunyikan carousel jika sebelumnya dipakai
                    const panduanCarousel = document.getElementById('panduan-carousel');
                    if (panduanCarousel) {
                        panduanCarousel.classList.add('hidden');
                    }
                    
                    ceritaText.classList.remove('hidden');
                    ceritaText.innerHTML = currentSoal.popText;
                    btnMulaiPetualangan.innerHTML = "<img src='Asset/images/next.svg' alt='Lanjut' style='height: 45px;'>"; // Use next.svg
                    btnMulaiPetualangan.style.pointerEvents = 'auto';
                    btnMulaiPetualangan.style.display = 'block';
                    
                    document.getElementById('cerita-overlay').classList.remove('hidden');
                    audioBenar.src = `Asset/audio/benar-${currentSoal.id}.mp3`;
                    if (isMusicPlaying) {
                        fadeAudioVolume(audioBgmGame, 0.2, 500); // Turunkan BGM
                    }
                    audioBenar.play().catch(e => console.log(e));
                    audioBenar.onended = () => {
                        if (isMusicPlaying) {
                            fadeAudioVolume(audioBgmGame, 1.0, 500); // Naikkan BGM kembali
                        }
                    };
                }, 600);
                
            } else {
                // SALAH (jawaban kosong / objek lain)
                audioSfxWrong.play().catch(e => console.log(e));
                // Hukuman/nyawa sudah dihilangkan sesuai request
            }
        });

        // Pan and Pinch Zoom (Pointer Events)
        const activePointers = new Map();
        let gestureMode = 'none';
        let pinchStartDist = 0, pinchStartScale = 1;
        let pinchMidX = 0, pinchMidY = 0;
        let pinchMapX = 0, pinchMapY = 0;

        function getDistance(a, b) {
            return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        }
        function getMidpoint(a, b) {
            return { x: (a.clientX + b.clientX)/2, y: (a.clientY + b.clientY)/2 };
        }

        mapWrap.addEventListener('pointerdown', event => {
            if(event.pointerType === 'mouse' && event.button !== 0) return;
            activePointers.set(event.pointerId, event);
            // try { mapWrap.setPointerCapture(event.pointerId); } catch(e) {}

            if(activePointers.size >= 2) {
                const pts = [...activePointers.values()];
                const mid = getMidpoint(pts[0], pts[1]);
                pinchStartDist = Math.max(1, getDistance(pts[0], pts[1]));
                pinchStartScale = scale;
                pinchMidX = mid.x; pinchMidY = mid.y;
                pinchMapX = x; pinchMapY = y;
                gestureMode = 'pinch';
                moved = true;
                svgMap.style.transition = 'none'; // Pastikan tidak ada delay saat pinch
                return;
            }

            gestureMode = 'pan';
            dragging = true;
            moved = false;
            startX = event.clientX;
            startY = event.clientY;
            startMapX = x;
            startMapY = y;
            svgMap.style.transition = 'none'; // Pastikan tidak ada delay saat pan
            mapWrap.classList.add('dragging');
        });

        mapWrap.addEventListener('pointermove', event => {
            if(!activePointers.has(event.pointerId)) return;
            activePointers.set(event.pointerId, event);

            if(activePointers.size >= 2) {
                const pts = [...activePointers.values()];
                const mid = getMidpoint(pts[0], pts[1]);
                const d = Math.max(1, getDistance(pts[0], pts[1]));
                
                let newScale = pinchStartScale * (d / pinchStartDist);
                newScale = Math.min(8, Math.max(0.2, newScale));
                
                const rect = svgMap.getBoundingClientRect();
                const startPx = pinchMidX - rect.left;
                const startPy = pinchMidY - rect.top;
                const newPx = mid.x - rect.left;
                const newPy = mid.y - rect.top;
                const ratio = newScale / pinchStartScale;

                x = newPx - (startPx - pinchMapX) * ratio + (mid.x - pinchMidX);
                y = newPy - (startPy - pinchMapY) * ratio + (mid.y - pinchMidY);
                scale = newScale;
                
                scheduleRender();
                return;
            }

            if(gestureMode !== 'pan' || !dragging) return;
            
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            if(Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) moved = true;
            
            x = startMapX + dx;
            y = startMapY + dy;
            scheduleRender();
        });

        function endPointer(event) {
            activePointers.delete(event.pointerId);
            // try { mapWrap.releasePointerCapture(event.pointerId); } catch(e) {}

            if(activePointers.size === 0) {
                dragging = false;
                mapWrap.classList.remove('dragging');
                setTimeout(() => { moved = false; gestureMode = 'none'; }, 0);
            } else if (activePointers.size === 1) {
                const remaining = [...activePointers.values()][0];
                gestureMode = 'pan';
                dragging = true;
                startX = remaining.clientX;
                startY = remaining.clientY;
                startMapX = x;
                startMapY = y;
                moved = true;
            }
        }

        mapWrap.addEventListener('pointerup', endPointer);
        mapWrap.addEventListener('pointercancel', endPointer);

        // Wheel Zoom
        let wheelTimeout;
        mapWrap.addEventListener('wheel', event => {
            event.preventDefault();
            
            // Berikan transisi halus saat menggunakan scroll wheel
            svgMap.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if(svgMap) svgMap.style.transition = 'none';
            }, 150);

            // Menggunakan pengali zoom yang lebih halus (1.15) daripada langsung meloncat jauh
            zoomAt(event.deltaY < 0 ? 1.15 : 0.85, event.clientX, event.clientY);
        }, { passive: false });

        scheduleRender();
    }

    // Call loadMap to start fetching the SVG in the background
    loadMap();

});
