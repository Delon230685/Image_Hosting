/**
 * Image Hosting Application - JavaScript
 */

// =============================================
// SERVICE WORKER FIX - Отключаем все Service Workers
// =============================================
(function() {
    'use strict';

    // Отключаем Service Workers полностью
    if ('serviceWorker' in navigator) {
        // Удаляем все зарегистрированные workers
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                console.log('Unregistering Service Worker:', registration.scope);
                registration.unregister();
            }
        }).catch(function(error) {
            console.log('Service Worker unregistration failed:', error);
        });

        // Предотвращаем регистрацию новых workers
        navigator.serviceWorker.register = function() {
            return Promise.reject(new Error('Service Workers are disabled for this app'));
        };

        // Отключаем контроллер
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({type: 'TERMINATE'});
        }
    }

    // Обработчик для предотвращения ошибок Promise
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('Prevented unhandled promise rejection:', event.reason);
        event.preventDefault();
    });

    // Обработчик для ошибок
    window.addEventListener('error', function(event) {
        console.error('Global error:', event.error);
    });
})();

// =============================================
// ОСНОВНОЙ КОД ПРИЛОЖЕНИЯ
// =============================================
class ImageHostingApp {
    constructor() {
        this.currentPageNumber = 1;
        this.itemsPerPage = 10;

        // Фоновые изображения
        this.heroImages = [
            '/assets/images/bird.png',
            '/assets/images/cat.png',
            '/assets/images/dog1.png',
            '/assets/images/dog2.png',
            '/assets/images/dog3.png'
        ];

        this.availableHeroImages = [];
        this.isInitialized = false;

        this.initializeApp();
    }

    initializeApp() {
        if (this.isInitialized) return;

        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupApp());
            } else {
                this.setupApp();
            }
            this.isInitialized = true;
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }

    async setupApp() {
        try {
            this.cacheElements();
            await this.checkHeroImages();
            this.setupEventHandlers();
            this.initializeUI();
            console.log('✅ Image Hosting App initialized successfully');
        } catch (error) {
            console.error('❌ App setup failed:', error);
        }
    }

    cacheElements() {
        console.log('Caching DOM elements...');

        // Основные элементы
        this.heroPage = document.getElementById('hero-page');
        this.mainAppPage = document.getElementById('main-app-page');
        this.gotoAppButton = document.getElementById('goto-app-button');

        // Навигация
        this.navButtons = document.querySelectorAll('.app-nav__button');
        this.uploadView = document.getElementById('upload-view');
        this.imagesView = document.getElementById('images-view');

        // Загрузка файлов
        this.dropZone = document.getElementById('upload-drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.browseBtn = document.getElementById('browse-btn');
        this.uploadError = document.getElementById('upload-error');
        this.urlInput = document.getElementById('url-input');
        this.copyBtn = document.getElementById('copy-btn');

        // Список изображений
        this.imagesTableBody = document.getElementById('images-table-body');
        this.imagesCount = document.getElementById('images-count');
        this.currentPageEl = document.getElementById('current-page');
        this.totalPagesEl = document.getElementById('total-pages');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.pageNumbers = document.getElementById('page-numbers');
        this.noImagesMessage = document.getElementById('no-images-message');

        console.log('DOM elements cached successfully');
    }

    async checkHeroImages() {
        console.log('Checking hero images availability...');

        const checks = this.heroImages.map(async (imageSrc) => {
            try {
                const response = await fetch(imageSrc, {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                if (response.ok) {
                    console.log(`✅ Image available: ${imageSrc}`);
                    return imageSrc;
                }
                console.log(`❌ Image not found: ${imageSrc}`);
                return null;
            } catch (error) {
                console.log(`❌ Image error: ${imageSrc}`, error);
                return null;
            }
        });

        const results = await Promise.allSettled(checks);
        this.availableHeroImages = results
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value);

        console.log(`Available images: ${this.availableHeroImages.length}`);

        if (this.availableHeroImages.length === 0) {
            this.createFallbackBackground();
        }
    }

    createFallbackBackground() {
        console.log('Creating fallback background...');
        if (this.heroPage) {
            this.heroPage.style.background = 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)';
        }
    }

    setupEventHandlers() {
        console.log('Setting up event handlers...');

        // Кнопка перехода
        if (this.gotoAppButton) {
            this.gotoAppButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMainApp();
            });
        }

        // Навигация
        this.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e);
            });
        });

        // Загрузка файлов
        this.setupUploadHandlers();

        // Пагинация
        this.setupPaginationHandlers();

        // Удаление
        this.setupDeleteHandlers();

        console.log('Event handlers setup completed');
    }

    setupUploadHandlers() {
        // Кнопка выбора файла
        if (this.browseBtn && this.fileInput) {
            this.browseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.fileInput.click();
            });
        }

        // Выбор файла
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                e.preventDefault();
                if (e.target.files && e.target.files[0]) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }

        // Drag and Drop
        if (this.dropZone) {
            // Click
            this.dropZone.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.fileInput) this.fileInput.click();
            });

            // Drag events
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.dropZone.addEventListener(eventName, this.preventDefaults, false);
            });

            // Visual feedback
            ['dragenter', 'dragover'].forEach(eventName => {
                this.dropZone.addEventListener(eventName, () => {
                    this.dropZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                this.dropZone.addEventListener(eventName, () => {
                    this.dropZone.classList.remove('dragover');
                }, false);
            });

            // Handle drop
            this.dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                    this.handleFileUpload(files[0]);
                }
            }, false);
        }

        // Copy URL
        if (this.copyBtn && this.urlInput) {
            this.copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyUrlToClipboard();
            });
        }
    }

    setupPaginationHandlers() {
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadPreviousPage();
            });
        }

        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadNextPage();
            });
        }
    }

    setupDeleteHandlers() {
        if (this.imagesTableBody) {
            this.imagesTableBody.addEventListener('click', (e) => {
                const deleteButton = e.target.closest('.table-delete-btn');
                if (deleteButton) {
                    e.preventDefault();
                    const imageId = deleteButton.dataset.id;
                    this.handleDeleteImage(imageId, deleteButton);
                }
            });
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    showMainApp() {
        if (this.heroPage && this.mainAppPage) {
            this.heroPage.classList.add('hidden');
            this.mainAppPage.classList.remove('hidden');
        }
    }

    handleNavigation(e) {
        const button = e.currentTarget;
        const view = button.dataset.view;

        // Update active button
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Switch views
        if (view === 'upload') {
            this.showUploadView();
        } else {
            this.showImagesView();
        }
    }

    showUploadView() {
        if (this.uploadView) this.uploadView.classList.remove('hidden');
        if (this.imagesView) this.imagesView.classList.add('hidden');
    }

    showImagesView() {
        if (this.uploadView) this.uploadView.classList.add('hidden');
        if (this.imagesView) this.imagesView.classList.remove('hidden');
        this.loadImages();
    }

    async handleFileUpload(file) {
        console.log('Starting file upload:', file.name, file.size);

        this.resetUploadUI();
        this.showUploadLoading();

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.handleUploadResponse(data);

        } catch (error) {
            console.error('Upload failed:', error);
            this.showUploadError('Upload failed due to network error.');
        } finally {
            this.hideUploadLoading();
        }
    }

    resetUploadUI() {
        if (this.urlInput) this.urlInput.value = '';
        if (this.uploadError) {
            this.uploadError.classList.add('hidden');
            this.uploadError.style.color = '';
        }
    }

    showUploadLoading() {
        if (this.browseBtn) {
            this.browseBtn.disabled = true;
            this.browseBtn.innerHTML = '<div class="spinner"></div> Uploading...';
        }
    }

    hideUploadLoading() {
        if (this.browseBtn) {
            this.browseBtn.disabled = false;
            this.browseBtn.textContent = 'Browse your file';
        }
    }

    handleUploadResponse(data) {
        if (data.status === 'success') {
            if (this.urlInput) {
                this.urlInput.value = window.location.origin + data.url;
            }
            this.showUploadSuccess('File uploaded successfully!');

            // Auto-switch to images list
            setTimeout(() => {
                const imagesButton = document.querySelector('[data-view="images"]');
                if (imagesButton) imagesButton.click();
            }, 1500);
        } else {
            this.showUploadError(data.message);
        }
    }

    showUploadSuccess(message) {
        if (this.uploadError) {
            this.uploadError.textContent = message;
            this.uploadError.style.color = 'green';
            this.uploadError.classList.remove('hidden');
        }
    }

    showUploadError(message) {
        if (this.uploadError) {
            this.uploadError.textContent = message;
            this.uploadError.style.color = 'red';
            this.uploadError.classList.remove('hidden');
        }
    }

    async copyUrlToClipboard() {
        if (!this.urlInput || !this.urlInput.value) return;

        try {
            await navigator.clipboard.writeText(this.urlInput.value);
            this.showCopyFeedback();
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.fallbackCopyToClipboard();
        }
    }

    showCopyFeedback() {
        if (this.copyBtn) {
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'COPIED!';
            setTimeout(() => {
                if (this.copyBtn) {
                    this.copyBtn.textContent = originalText;
                }
            }, 2000);
        }
    }

    fallbackCopyToClipboard() {
        if (!this.urlInput) return;

        this.urlInput.select();
        this.urlInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        this.showCopyFeedback();
    }

    async loadImages(page = 1) {
        this.currentPageNumber = page;

        if (!this.imagesTableBody) return;

        this.showImagesLoading();

        try {
            const response = await fetch(`/images-list?page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            this.displayImages(data);

        } catch (error) {
            console.error('Error loading images:', error);
            this.showImagesError();
        }
    }

    showImagesLoading() {
        if (this.imagesTableBody) {
            this.imagesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <div class="spinner"></div> Loading images...
                    </td>
                </tr>
            `;
        }
        if (this.noImagesMessage) {
            this.noImagesMessage.classList.add('hidden');
        }
    }

    showImagesError() {
        if (this.imagesTableBody) {
            this.imagesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--error-color);">
                        Error loading images. Please try again.
                    </td>
                </tr>
            `;
        }
    }

    displayImages(data) {
        if (!this.imagesTableBody) return;

        const images = data.images || [];
        const pagination = data.pagination || {};

        this.updateImagesCount(pagination.total_count || 0);
        this.updatePaginationInfo(pagination);
        this.renderImagesTable(images);
        this.updatePaginationControls(pagination);
    }

    updateImagesCount(totalCount) {
        if (this.imagesCount) {
            this.imagesCount.textContent = `Total: ${totalCount} images`;
        }
    }

    updatePaginationInfo(pagination) {
        if (this.currentPageEl) {
            this.currentPageEl.textContent = pagination.current_page || 1;
        }
        if (this.totalPagesEl) {
            this.totalPagesEl.textContent = pagination.total_pages || 1;
        }
    }

    renderImagesTable(images) {
        if (!this.imagesTableBody) return;

        if (images.length === 0) {
            this.showNoImagesMessage();
            return;
        }

        const html = images.map(image => `
            <tr>
                <td>
                    <a href="/images/${image.filename}" class="image-link" target="_blank">
                        ${image.filename}
                    </a>
                </td>
                <td>${image.original_name}</td>
                <td>${image.size_kb}</td>
                <td>${image.upload_time}</td>
                <td>${image.file_type}</td>
                <td>
                    <button class="table-delete-btn" data-id="${image.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');

        this.imagesTableBody.innerHTML = html;

        if (this.noImagesMessage) {
            this.noImagesMessage.classList.add('hidden');
        }
    }

    showNoImagesMessage() {
        if (this.imagesTableBody) {
            this.imagesTableBody.innerHTML = '';
        }
        if (this.noImagesMessage) {
            this.noImagesMessage.classList.remove('hidden');
        }
    }

    updatePaginationControls(pagination) {
        const currentPage = pagination.current_page || 1;
        const totalPages = pagination.total_pages || 1;

        this.updatePaginationButtons(currentPage, totalPages);
        this.updatePageNumbers(currentPage, totalPages);
    }

    updatePaginationButtons(currentPage, totalPages) {
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = currentPage <= 1;
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = currentPage >= totalPages;
        }
    }

    updatePageNumbers(currentPage, totalPages) {
        if (!this.pageNumbers) return;

        this.pageNumbers.innerHTML = '';

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadImages(i);
            });
            this.pageNumbers.appendChild(pageButton);
        }
    }

    loadPreviousPage() {
        if (this.currentPageNumber > 1) {
            this.loadImages(this.currentPageNumber - 1);
        }
    }

    loadNextPage() {
        const totalPages = parseInt(this.totalPagesEl?.textContent) || 1;
        if (this.currentPageNumber < totalPages) {
            this.loadImages(this.currentPageNumber + 1);
        }
    }

    async handleDeleteImage(imageId, deleteButton) {
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }

        this.showDeleteLoading(deleteButton);

        try {
            const response = await fetch(`/delete/${imageId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.loadImages(this.currentPageNumber);
            } else {
                this.showDeleteError(deleteButton, data.message);
            }

        } catch (error) {
            console.error('Delete failed:', error);
            this.showDeleteError(deleteButton, 'Delete failed due to network error.');
        }
    }

    showDeleteLoading(deleteButton) {
        deleteButton.disabled = true;
        deleteButton.innerHTML = '<div class="spinner"></div>';
    }

    showDeleteError(deleteButton, message) {
        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete';
        alert('Error deleting image: ' + message);
    }

    initializeUI() {
        // Set random hero image
        this.setRandomHeroImage();

        // Load initial data if needed
        if (this.imagesView && !this.imagesView.classList.contains('hidden')) {
            this.loadImages();
        }
    }

    setRandomHeroImage() {
        if (!this.heroPage || this.availableHeroImages.length === 0) {
            this.createFallbackBackground();
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.availableHeroImages.length);
        const randomImage = this.availableHeroImages[randomIndex];

        console.log('Setting background image:', randomImage);

        // Preload image for reliability
        const img = new Image();
        img.onload = () => {
            this.heroPage.style.backgroundImage = `url(${randomImage})`;
            this.heroPage.style.backgroundSize = 'cover';
            this.heroPage.style.backgroundPosition = 'center';
            console.log('Background image loaded successfully');
        };
        img.onerror = () => {
            console.warn('Failed to load background image, using fallback');
            this.createFallbackBackground();
        };
        img.src = randomImage;
    }
}

// Initialize application
new ImageHostingApp();