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
    const hudNyawa = document.getElementById('hud-nyawa');
    const textSkor = document.getElementById('text-skor');
    const audioSfxCorrect = document.getElementById('audio-sfx-correct');
    const audioSfxWrong = document.getElementById('audio-sfx-wrong');
    const audioSfxNotif = document.getElementById('audio-sfx-notif');
    const audioBgmGame = document.getElementById('audio-bgm-game');
    const audioBgmWin = document.getElementById('audio-bgm-win');
    const audioSoal = document.getElementById('audio-soal');
    const audioBenar = document.getElementById('audio-benar');
    
    const endingPage = document.getElementById('ending-page');
    const refleksiText = document.getElementById('refleksi-text');
    const btnKeluar = document.getElementById('btn-keluar');
    const btnMainLagi = document.getElementById('btn-main-lagi');

    let isMusicPlaying = true;
    let typeWriterTimeout = null;
    
    const textPembuka = "Halo, teman-teman! Hari ini kita akan bermain Petak Umpet Nusantara. Sambil mencari teman-teman kita yang bersembunyi, kita juga akan belajar mengenal berbagai pakaian adat dari seluruh Indonesia beserta ciri khas dan filosofinya. Yuk, kita mulai petualangannya";
    const textPetunjuk = "Perhatikan petunjuk berupa suara atau tulisan yang muncul untuk mencari tahu pakaian adat dari daerah mana yang sedang bersembunyi! Cari dan Klik ikon di peta yang sesuai dengan petunjuk tersebut. Jawaban yang benar akan menambah skormu, tetapi hati-hati karena tebakan yang keliru akan mengurangi poin!";

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
        } else {
            musicIcon.src = 'Asset/images/music-off.svg';
            audioPembuka.pause();
            audioPetunjuk.pause();
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
        // Hide landing page, show story page
        landingPage.classList.add('hidden');
        storyPage.classList.remove('hidden');

        // Start Story Sequence
        playStorySequence();
    }

    function playStorySequence() {
        // Show first text with typewriter effect and play first audio
        typeWriter(textPembuka, ceritaText, 80); 
        
        if (isMusicPlaying) {
            audioPembuka.play().catch(e => console.log("Audio autoplay prevented", e));
        }

        // When first audio ends, play second audio
        audioPembuka.onended = () => {
            ceritaTitle.classList.remove('hidden'); // Munculkan judul "Panduan Permainan"
            
            // Hentikan pengetikan jika ada sisa dan langsung tampilkan teks penuh
            if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
            ceritaText.textContent = textPetunjuk;
            
            if (isMusicPlaying) {
                audioPetunjuk.play();
            }
        };

        audioPetunjuk.onended = () => {
            console.log("Instruksi selesai dibacakan.");
        };
    }

    // --- GAME STATE ---
    let isGameStarted = false;
    let nyawa = 3;
    let skor = 0;
    let currentRoundIndex = 0;
    
    const soalList = [
        { id: 'aceh', text: 'Pakaian tradisional dari ujung barat Indonesia, sering dipakai untuk Tari Saman!', target: ['aceh', 'aceh-rumah', 'aceh-ruma'], popText: 'Hebat! Kamu menemukan pakaian adat Aceh! Pakaian ini sangat khas dengan sentuhan corak islami dan ikat kepala tradisionalnya.' },
        { id: 'bali', text: 'Pakaian adat yang dilengkapi Udeng dan kain kamben untuk upacara budaya!', target: ['bali', 'bali-rumah'], popText: 'Wah, ini dia pakaian adat Bali! Made dari Bali ini dilengkapi dengan Udeng atau ikat kepala khas, serta kain kamben yang biasa digunakan dalam kegiatan upacara budaya!' },
        { id: 'dayak', text: 'Pakaian adat dari suku di pedalaman hutan tropis dengan motif burung enggang!', target: ['dayak', 'dayak-rumah'], popText: 'Tepat! Ini adalah pakaian adat Dayak dari Kalimantan. Hiasan kepalanya menggunakan bulu burung enggang yang melambangkan keagungan!' },
        { id: 'jawa', text: 'Pakaian adat dengan blangkon dan kebaya yang anggun!', target: ['jawa', 'jawa-rumah', 'joglo'], popText: 'Benar sekali! Ini adalah pakaian adat Jawa. Laki-laki mengenakan blangkon sebagai penutup kepala dan kain batik yang indah!' },
        { id: 'papua', text: 'Pakaian adat berupa rok rumbai dari serat daun sagu kering dan mahkota burung cendrawasih!', target: ['papua', 'papua-rumah', 'honai'], popText: 'Luar biasa! Kamu berhasil menemukan pakaian adat Papua berupa rok rumbai dari serat daun sagu kering, berpadu mahkota burung cendrawasih yang melambangkan kedekatan dengan alam!' },
        { id: 'toraja', text: 'Pakaian adat dari daerah yang terkenal dengan rumah Tongkonan!', target: ['toraja', 'toraja-rumah'], popText: 'Luar biasa! Ini pakaian adat Toraja dari Sulawesi Selatan, sangat khas dengan perpaduan warna merah, kuning, dan putih!' }
    ];

    // Acak urutan soal
    soalList.sort(() => Math.random() - 0.5);

    function updateHudNyawa() {
        hudNyawa.innerHTML = '';
        for(let i=0; i<3; i++) {
            const img = document.createElement('img');
            img.src = i < nyawa ? 'Asset/images/nyawa.svg' : 'Asset/images/mati.svg';
            hudNyawa.appendChild(img);
        }
    }
    
    function updateHudSkor() {
        textSkor.textContent = `${skor} / 6`;
    }

    function playNextSoal() {
        if (currentRoundIndex >= soalList.length) {
            winGame();
            return;
        }
        const currentSoal = soalList[currentRoundIndex];
        
        if (isMusicPlaying) {
            audioSfxNotif.play();
            audioSfxNotif.onended = () => {
                audioSoal.src = `Asset/audio/soal-${currentSoal.id}.mp3`;
                audioSoal.play();
            };
        }
    }

    function winGame() {
        audioBgmGame.pause();
        if(isMusicPlaying) audioBgmWin.play();
        mapPage.classList.add('hidden');
        endingPage.classList.remove('hidden');
    }

    function loseGame() {
        ceritaKarakter.style.display = 'none'; // Sembunyikan karakter
        ceritaTitle.classList.remove('hidden');
        ceritaTitle.textContent = "Game Over!";
        ceritaText.textContent = "Nyawa kamu habis! Jangan menyerah, ayo coba lagi!";
        btnMulaiPetualangan.textContent = "Ulangi";
        ceritaOverlay.classList.remove('hidden');
        mapPage.appendChild(ceritaOverlay);
        btnMulaiPetualangan.onclick = () => location.reload();
    }

    // Handle Button Click (Mulai / Lanjut)
    btnMulaiPetualangan.addEventListener('click', () => {
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

            updateHudNyawa();
            updateHudSkor();
            if(isMusicPlaying) audioBgmGame.play();
            playNextSoal();
            
            console.log("Petualangan dimulai!");
        } else {
            // Logika tombol "Lanjut" setelah jawaban benar
            ceritaOverlay.classList.add('hidden');
            audioBenar.pause();
            currentRoundIndex++;
            playNextSoal();
        }
    });

    // Handle Ending Page logic
    refleksiText.addEventListener('input', () => {
        if(refleksiText.value.trim().length > 0) {
            btnKeluar.classList.remove('disabled');
            btnKeluar.removeAttribute('disabled');
        } else {
            btnKeluar.classList.add('disabled');
            btnKeluar.setAttribute('disabled', 'true');
        }
    });
    
    btnKeluar.addEventListener('click', () => {
        alert("Terima kasih telah bermain Petak Umpet Nusantara!");
        location.reload();
    });
    btnMainLagi.addEventListener('click', () => location.reload());

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

    function renderMap() {
        if(!svgMap) return;
        svgMap.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    function zoomAt(zoomMultiplier, centerX, centerY) {
        if(!svgMap) return;
        const rect = svgMap.getBoundingClientRect();
        
        // Batasi zoom
        let newScale = scale * zoomMultiplier;
        newScale = Math.min(Math.max(0.2, newScale), 8);
        const actualMultiplier = newScale / scale;

        const px = centerX - rect.left;
        const py = centerY - rect.top;

        x -= px * (actualMultiplier - 1);
        y -= py * (actualMultiplier - 1);
        scale = newScale;

        renderMap();
    }

    function initMapInteractive() {
        // Setup clickable areas (Semua ornamen, pohon, binatang, rumah)
        const clickableLabels = [
            'aceh-rumah','aceh-ruma','aceh-masjid','g79','g77','g80','g78','gn-ac','ph-su',
            'gajah','joglo','jawa-rumah','g90','g88','g31','g28','g89','orang-utan','dayak',
            'dayak-rumah','g95','ph-d-2','g96','g59','g56','toraja','toraja-rumah','bird-2',
            'g49','g50','g46','g48','bali','bali-rumah','g93','g39','honai','papua-rumah',
            'g99','g98','bird-1','cend-1','g101','g71','g69','g68',
            'aceh-karakter','jawa-karakter','bali-karakter','toraja-karakter','dayak-karakter','papua-karakter'
        ];

        clickableLabels.forEach(name => {
            const byId = document.getElementById(name);
            if(byId) byId.classList.add('map-clickable');

            svgMap.querySelectorAll('[inkscape\\:label]').forEach(el => {
                if(el.getAttribute('inkscape:label') === name) {
                    el.classList.add('map-clickable');
                }
            });
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
            if(currentRoundIndex >= soalList.length || nyawa <= 0) return;
            
            const currentSoal = soalList[currentRoundIndex];
            audioSoal.pause(); // Hentikan audio soal jika masih bermain
            
            if(currentSoal.target.includes(targetId) || currentSoal.target.includes(targetId.replace('-ruma', '-rumah'))) {
                // BENAR
                audioSfxCorrect.play().catch(e => console.log(e));
                skor++;
                updateHudSkor();
                
                // Munculkan ikon anak di atas elemen yang diklik (di dalam SVG)
                try {
                    const bbox = target.getBBox();
                    const childIcon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    childIcon.setAttribute('href', `Asset/images/ikon-${currentSoal.id}.png`);
                    childIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `Asset/images/ikon-${currentSoal.id}.png`);
                    
                    // Posisi sedikit di atas rumah/ornamen dan agak ke tengah
                    const iconWidth = Math.max(bbox.width * 1.5, 60); 
                    const iconHeight = iconWidth;
                    childIcon.setAttribute('x', bbox.x + (bbox.width / 2) - (iconWidth / 2));
                    childIcon.setAttribute('y', bbox.y - (iconHeight * 0.8)); // Muncul dari balik atap
                    childIcon.setAttribute('width', iconWidth);
                    childIcon.setAttribute('height', iconHeight);
                    childIcon.classList.add('muncul-animasi'); // Tambahkan animasi jika ada
                    
                    // Sisipkan tepat setelah elemen target agar berada di layer atasnya
                    if(target.parentNode) {
                        target.parentNode.insertBefore(childIcon, target.nextSibling);
                    } else {
                        svgMap.appendChild(childIcon);
                    }
                } catch(e) {
                    console.error("Gagal menaruh ikon:", e);
                }
                
                // Beri jeda sedikit agar pemain bisa melihat anak yang muncul di peta sebelum popup menutupi layar
                setTimeout(() => {
                    ceritaKarakter.style.display = 'block';
                    ceritaKarakter.src = `Asset/images/pop-${currentSoal.id}.png`;
                    ceritaTitle.classList.remove('hidden');
                    ceritaTitle.textContent = "Berhasil!";
                    ceritaText.textContent = currentSoal.popText;
                    
                    audioBenar.src = `Asset/audio/benar-${currentSoal.id}.mp3`;
                    audioBenar.play().catch(e => console.log(e));
                    
                    ceritaOverlay.classList.remove('hidden');
                }, 1200);
                
            } else {
                // SALAH (jawaban kosong / objek lain)
                audioSfxWrong.play().catch(e => console.log(e));
                nyawa--;
                updateHudNyawa();
                
                if (nyawa <= 0) {
                    loseGame();
                }
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
            try { mapWrap.setPointerCapture(event.pointerId); } catch(e) {}

            if(activePointers.size >= 2) {
                const pts = [...activePointers.values()];
                const mid = getMidpoint(pts[0], pts[1]);
                pinchStartDist = Math.max(1, getDistance(pts[0], pts[1]));
                pinchStartScale = scale;
                pinchMidX = mid.x; pinchMidY = mid.y;
                pinchMapX = x; pinchMapY = y;
                gestureMode = 'pinch';
                moved = true;
                return;
            }

            gestureMode = 'pan';
            dragging = true;
            moved = false;
            startX = event.clientX;
            startY = event.clientY;
            startMapX = x;
            startMapY = y;
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
                
                renderMap();
                return;
            }

            if(gestureMode !== 'pan' || !dragging) return;
            
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            if(Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) moved = true;
            
            x = startMapX + dx;
            y = startMapY + dy;
            renderMap();
        });

        function endPointer(event) {
            activePointers.delete(event.pointerId);
            try { mapWrap.releasePointerCapture(event.pointerId); } catch(e) {}

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
        mapWrap.addEventListener('wheel', event => {
            event.preventDefault();
            zoomAt(event.deltaY < 0 ? 1.12 : 0.89, event.clientX, event.clientY);
        }, { passive: false });

        renderMap();
    }

    // Call loadMap to start fetching the SVG in the background
    loadMap();

});
