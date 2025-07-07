// Import Supabase client
import supabase from './supabaseCli.js';

// Global variables
let allOrders = [];
let currentFilters = {
    status: '',
    meal: '',
    date: ''
};
let selectedOrderId = null;

// DOM elements
const totalOrdersEl = document.getElementById('totalOrders');
const pendingOrdersEl = document.getElementById('pendingOrders');
const completedOrdersEl = document.getElementById('completedOrders');
const todayOrdersEl = document.getElementById('todayOrders');
const statusFilter = document.getElementById('statusFilter');
const mealFilter = document.getElementById('mealFilter');
const dateFilter = document.getElementById('dateFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const refreshBtn = document.getElementById('refreshBtn');
const ordersTableBody = document.getElementById('ordersTableBody');
const orderCountEl = document.getElementById('orderCount');
const loadingMessage = document.getElementById('loadingMessage');
const noOrdersMessage = document.getElementById('noOrdersMessage');
const orderModal = document.getElementById('orderModal');
const orderDetails = document.getElementById('orderDetails');
const statusModal = document.getElementById('statusModal');
const newStatusSelect = document.getElementById('newStatus');
const toastContainer = document.getElementById('toastContainer');

// Toast notification system (same as main app)
function showToast(type, title, message, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    return toast;
}

function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 500);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    
    // Filter event listeners
    statusFilter.addEventListener('change', applyFilters);
    mealFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    refreshBtn.addEventListener('click', loadOrders);
    
    // Modal event listeners
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeModal();
        }
        if (event.target === statusModal) {
            closeStatusModal();
        }
    });
    
    // Status update event listeners
    document.getElementById('updateStatusBtn').addEventListener('click', openStatusModal);
    document.getElementById('saveStatusBtn').addEventListener('click', updateOrderStatus);
    document.getElementById('cancelStatusBtn').addEventListener('click', closeStatusModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
});

// Load orders from Supabase
async function loadOrders() {
    try {
        showLoading(true);
        
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error loading orders:', error);
            // Show demo data when table doesn't exist
            allOrders = [
                {
                    id: 'DEMO-001',
                    meal: 'jollof-rice',
                    meal_name: 'Jollof Rice',
                    spices: ['curry-blend', 'garlic-herb'],
                    status: 'pending',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'DEMO-002',
                    meal: 'shawarma',
                    meal_name: 'Shawarma',
                    spices: ['lemon-pepper'],
                    status: 'completed',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            showToast('warning', 'Demo Mode', 'Orders table not found. Showing demo data.');
        } else {
            allOrders = data || [];
        }
        
        updateStats();
        applyFilters();
        showToast('success', 'Orders Loaded', `Successfully loaded ${allOrders.length} orders.`);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('error', 'Load Failed', 'Failed to load orders from database.');
    } finally {
        showLoading(false);
    }
}

// Update statistics
function updateStats() {
    const total = allOrders.length;
    const pending = allOrders.filter(order => order.status === 'pending').length;
    const completed = allOrders.filter(order => order.status === 'completed').length;
    
    // Calculate today's orders
    const today = new Date().toISOString().split('T')[0];
    const todayCount = allOrders.filter(order => 
        order.created_at.startsWith(today)
    ).length;
    
    totalOrdersEl.textContent = total;
    pendingOrdersEl.textContent = pending;
    completedOrdersEl.textContent = completed;
    todayOrdersEl.textContent = todayCount;
}

// Apply filters
function applyFilters() {
    currentFilters.status = statusFilter.value;
    currentFilters.meal = mealFilter.value;
    currentFilters.date = dateFilter.value;
    
    let filteredOrders = [...allOrders];
    
    // Filter by status
    if (currentFilters.status) {
        filteredOrders = filteredOrders.filter(order => 
            order.status === currentFilters.status
        );
    }
    
    // Filter by meal
    if (currentFilters.meal) {
        filteredOrders = filteredOrders.filter(order => 
            order.meal === currentFilters.meal
        );
    }
    
    // Filter by date
    if (currentFilters.date) {
        filteredOrders = filteredOrders.filter(order => 
            order.created_at.startsWith(currentFilters.date)
        );
    }
    
    displayOrders(filteredOrders);
}

// Clear all filters
function clearFilters() {
    statusFilter.value = '';
    mealFilter.value = '';
    dateFilter.value = '';
    currentFilters = { status: '', meal: '', date: '' };
    displayOrders(allOrders);
}

// Display orders in table
function displayOrders(orders) {
    orderCountEl.textContent = `Showing ${orders.length} orders`;
    
    if (orders.length === 0) {
        ordersTableBody.innerHTML = '';
        noOrdersMessage.style.display = 'block';
        return;
    }
    
    noOrdersMessage.style.display = 'none';
    
    ordersTableBody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.meal_name}</td>
            <td>${formatSpices(order.spice_names)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewOrderDetails('${order.id}')">View</button>
                <button class="action-btn edit-btn" onclick="editOrderStatus('${order.id}')">Edit</button>
            </td>
        </tr>
    `).join('');
}

// Format spices for display
function formatSpices(spices) {
    if (!spices || spices.length === 0) {
        return '<em>No spices selected</em>';
    }
    return spices.join(', ');
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) {
            showToast('error', 'Order Not Found', 'Order details could not be loaded.');
            return;
        }
        
        selectedOrderId = orderId;
        
        const detailsHTML = `
            <div class="order-detail-item">
                <h4>🍽️ Order Information</h4>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Meal:</strong> ${order.meal_name}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
                <p><strong>Created:</strong> ${formatDate(order.created_at)}</p>
            </div>
            
            <div class="order-detail-item">
                <h4>🌶️ Spice Mixes</h4>
                ${order.spice_names && order.spice_names.length > 0 
                    ? `<ul>${order.spice_names.map(spice => `<li>${spice}</li>`).join('')}</ul>`
                    : '<p>No spice mixes selected</p>'
                }
            </div>
            
            <div class="order-detail-item">
                <h4>🥘 Ingredients</h4>
                <ul>
                    ${order.ingredients.map(ingredient => 
                        `<li>${ingredient.name} - ${ingredient.description}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
        
        orderDetails.innerHTML = detailsHTML;
        orderModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error viewing order details:', error);
        showToast('error', 'Error', 'Failed to load order details.');
    }
}

// Edit order status
function editOrderStatus(orderId) {
    selectedOrderId = orderId;
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        newStatusSelect.value = order.status;
    }
    statusModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open status modal from order details
function openStatusModal() {
    if (selectedOrderId) {
        const order = allOrders.find(o => o.id === selectedOrderId);
        if (order) {
            newStatusSelect.value = order.status;
        }
        statusModal.style.display = 'block';
        orderModal.style.display = 'none';
    }
}

// Update order status
async function updateOrderStatus() {
    if (!selectedOrderId) return;
    
    const newStatus = newStatusSelect.value;
    
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', selectedOrderId);
        
        if (error) {
            console.error('Error updating status:', error);
            showToast('error', 'Update Failed', 'Failed to update order status.');
            return;
        }
        
        // Update local data
        const orderIndex = allOrders.findIndex(o => o.id === selectedOrderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = newStatus;
        }
        
        // Refresh display
        updateStats();
        applyFilters();
        
        showToast('success', 'Status Updated', `Order status updated to ${newStatus}.`);
        closeStatusModal();
        closeModal();
        
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('error', 'Update Failed', 'Failed to update order status.');
    }
}

// Close modals
function closeModal() {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedOrderId = null;
}

function closeStatusModal() {
    statusModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedOrderId = null;
}

// Show/hide loading state
function showLoading(show) {
    if (show) {
        loadingMessage.style.display = 'block';
        noOrdersMessage.style.display = 'none';
    } else {
        loadingMessage.style.display = 'none';
    }
}

// Real-time subscription (optional)
function subscribeToOrders() {
    const subscription = supabase
        .from('orders')
        .on('INSERT', payload => {
            console.log('New order:', payload.new);
            showToast('info', 'New Order', 'A new order has been placed!');
            loadOrders(); // Refresh the list
        })
        .on('UPDATE', payload => {
            console.log('Order updated:', payload.new);
            showToast('info', 'Order Updated', 'An order has been updated!');
            loadOrders(); // Refresh the list
        })
        .subscribe();
    
    return subscription;
}

// Initialize real-time subscription
// Uncomment the line below if you want real-time updates
// const orderSubscription = subscribeToOrders(); 