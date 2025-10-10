/**
 * Toast Context System - Vanilla JavaScript equivalent of React Context
 * Manages toast notifications with different types and auto-dismissal
 */

class ToastContext {
  constructor() {
    this.toasts = [];
    this.listeners = [];
    this.container = null;
    this.initContainer();
  }

  /**
   * Initialize the toast container in the DOM
   */
  initContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      `;
      document.body.appendChild(this.container);
    }
  }

  /**
   * Subscribe to toast changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of toast changes
   */
  notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  /**
   * Show a toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    this.toasts.push(newToast);
    this.render();
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    return id;
  }

  /**
   * Remove a toast by ID
   */
  removeToast(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.render();
    this.notify();
  }

  /**
   * Success toast
   */
  success(message, duration = 3000) {
    return this.showToast(message, 'success', duration);
  }

  /**
   * Error toast
   */
  error(message, duration = 3000) {
    return this.showToast(message, 'danger', duration);
  }

  /**
   * Warning toast
   */
  warning(message, duration = 3000) {
    return this.showToast(message, 'warning', duration);
  }

  /**
   * Info toast
   */
  info(message, duration = 3000) {
    return this.showToast(message, 'info', duration);
  }

  /**
   * Get icon based on type
   */
  getIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      danger: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }

  /**
   * Get background color class based on type
   */
  getBackgroundClass(type) {
    const classes = {
      success: 'bg-success',
      danger: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    return classes[type] || classes.info;
  }

  /**
   * Get text color based on type
   */
  getTextColor(type) {
    const colors = {
      success: '#28a745',
      danger: '#dc3545',
      warning: '#eab308',
      info: '#0d7ef0'
    };
    return colors[type] || colors.info;
  }

  /**
   * Render all toasts
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = '';

    this.toasts.forEach(toast => {
      const toastEl = this.createToastElement(toast);
      this.container.appendChild(toastEl);
    });
  }

  /**
   * Create a toast element
   */
  createToastElement(toast) {
    const toastDiv = document.createElement('div');
    toastDiv.className = `toast ${this.getBackgroundClass(toast.type)} text-white`;
    toastDiv.style.cssText = `
      display: flex;
      align-items: flex-start;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-in-out;
      min-width: 300px;
    `;

    // Icon
    const iconSpan = document.createElement('span');
    iconSpan.className = `fas ${this.getIcon(toast.type)}`;
    iconSpan.style.cssText = `
      margin-right: 12px;
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    `;

    // Content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    `;

    // Title
    const titleSpan = document.createElement('strong');
    titleSpan.textContent = toast.type.charAt(0).toUpperCase() + toast.type.slice(1);
    titleSpan.style.cssText = `
      font-weight: 600;
      font-size: 14px;
      text-transform: capitalize;
    `;

    // Message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = toast.message;
    messageSpan.style.cssText = `
      font-size: 14px;
      opacity: 0.95;
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'btn-close btn-close-white';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      margin-left: 12px;
      opacity: 0.8;
      transition: opacity 0.2s;
      flex-shrink: 0;
    `;

    closeBtn.addEventListener('click', () => {
      this.removeToast(toast.id);
    });

    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.opacity = '1';
    });

    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.opacity = '0.8';
    });

    // Assemble
    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(messageSpan);

    toastDiv.appendChild(iconSpan);
    toastDiv.appendChild(contentDiv);
    toastDiv.appendChild(closeBtn);

    return toastDiv;
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    this.toasts = [];
    this.render();
    this.notify();
  }
}

// Global instance
const toastContext = new ToastContext();

/**
 * Hook-like function to use toast in vanilla JS
 * Usage: const toast = useToast();
 *        toast.success('Hello');
 */
function useToast() {
  return {
    showToast: (message, type, duration) => toastContext.showToast(message, type, duration),
    success: (message, duration) => toastContext.success(message, duration),
    error: (message, duration) => toastContext.error(message, duration),
    warning: (message, duration) => toastContext.warning(message, duration),
    info: (message, duration) => toastContext.info(message, duration),
    clearAll: () => toastContext.clearAll()
  };
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .toast {
    animation: slideIn 0.3s ease-in-out;
  }

  .btn-close-white:focus {
    outline: none;
    opacity: 1 !important;
  }
`;
document.head.appendChild(style);

// ===== CONTACT FORM HANDLER =====
// Initialize toast at the top level
const toast = useToast();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  // Check if form exists on this page
  if (!contactForm) {
    console.log('Contact form not found on this page');
    return;
  }

  const submitButton = contactForm.querySelector('.submit-button');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email is not valid');
      return;
    }

    // Submit
    submitButton.disabled = true;
    toast.info('Sending your message...');

    try {
      const web3FormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        web3FormData.append(key, value);
      });
      web3FormData.append('access_key', '4ee1cb82-7032-44f0-ad75-cbc496f874b1');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        contactForm.reset();
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      submitButton.disabled = false;
    }
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ToastContext, useToast, toastContext };
}

/**
 * MapContainer - Vanilla JavaScript equivalent of React GoogleMap component
 * Displays a Google Map with a marker that opens Google Maps when clicked
 */

class MapContainer {
  constructor(containerId, apiKey = null) {
    this.containerId = containerId;
    this.apiKey = apiKey;
    this.map = null;
    this.marker = null;
    
    // Center coordinates (Hayward, CA)
    this.center = {
      lat: 37.65674155384669,
      lng: -122.05619875493439
    };
    
    this.init();
  }

  /**
   * Initialize the map
   */
  async init() {
    const container = document.getElementById(this.containerId);
    
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
      console.warn('Google Maps API is not loaded. Using fallback map.');
      this.renderFallbackMap(container);
      return;
    }

    this.renderGoogleMap(container);
  }

  /**
   * Render actual Google Map
   */
  renderGoogleMap(container) {
    // Set container style
    container.style.cssText = `
      width: 100%;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
    `;

    // Create map
    this.map = new google.maps.Map(container, {
      zoom: 12,
      center: this.center,
      mapTypeControl: true,
      zoomControl: true,
      fullscreenControl: true,
      streetViewControl: true
    });

    // Add marker
    this.marker = new google.maps.Marker({
      position: this.center,
      map: this.map,
      title: 'PhishLens Office',
      animation: google.maps.Animation.DROP
    });

    // Add click listener to marker
    this.marker.addListener('click', () => this.handleMapClick());

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; font-family: Arial, sans-serif;">
          <h4 style="margin: 0 0 5px 0;">PhishLens Office</h4>
          <p style="margin: 0 0 3px 0;">25800 Carlos Bee Blvd</p>
          <p style="margin: 0 0 3px 0;">Hayward, CA 94542</p>
          <p style="margin: 0;">United States</p>
        </div>
      `
    });

    // Show info window on marker click
    this.marker.addListener('click', () => {
      infoWindow.open(this.map, this.marker);
    });
  }

  /**
   * Render fallback map (if Google Maps API not available)
   */
  renderFallbackMap(container) {
    container.style.cssText = `
      width: 100%;
      height: 300px;
      background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.05) 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed rgba(13, 110, 253, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      text-align: center;
      color: #0d6efd;
    `;

    const icon = document.createElement('i');
    icon.className = 'fas fa-map';
    icon.style.cssText = `
      font-size: 3rem;
      display: block;
      margin-bottom: 10px;
    `;

    const text = document.createElement('p');
    text.textContent = 'Click to view on Google Maps';
    text.style.cssText = `
      margin: 0;
      font-weight: 600;
      font-size: 1rem;
    `;

    contentDiv.appendChild(icon);
    contentDiv.appendChild(text);
    container.appendChild(contentDiv);

    // Add click handler to fallback map
    container.addEventListener('click', () => this.handleMapClick());

    // Hover effect
    container.addEventListener('mouseover', () => {
      container.style.background = 'linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(13, 110, 253, 0.1) 100%)';
      container.style.borderColor = 'rgba(13, 110, 253, 0.5)';
    });

    container.addEventListener('mouseout', () => {
      container.style.background = 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.05) 100%)';
      container.style.borderColor = 'rgba(13, 110, 253, 0.3)';
    });
  }

  /**
   * Handle map click - opens Google Maps in new tab
   */
  handleMapClick() {
    const googleMapsUrl = `https://www.google.com/maps?q=${this.center.lat},${this.center.lng}`;
    window.open(googleMapsUrl, '_blank');
  }

  /**
   * Update map center
   */
  setCenter(lat, lng) {
    this.center = { lat, lng };
    if (this.map) {
      this.map.setCenter(this.center);
    }
  }

  /**
   * Update marker position
   */
  setMarkerPosition(lat, lng) {
    if (this.marker) {
      this.marker.setPosition({ lat, lng });
    }
  }

  /**
   * Destroy map instance
   */
  destroy() {
    if (this.map) {
      this.map = null;
    }
    if (this.marker) {
      this.marker = null;
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MapContainer;
}
function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB6PMPp4XyqBoe5XJVcKHILewCWy8Bwk9k&libraries=places';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps API loaded but window.google.maps is undefined'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });
  }

//   // Usage example - call this after DOM is ready
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await loadGoogleMapsAPI();
      console.log('Google Maps API loaded successfully');
      
      // Now initialize your map
      const mapContainer = new MapContainer('google-map');
    } catch (error) {
      console.warn('Google Maps API not available:', error);
      // The MapContainer will use fallback
      const mapContainer = new MapContainer('google-map');
    }
  });