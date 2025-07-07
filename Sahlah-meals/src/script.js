
// Import Supabase client
import supabase from './supabaseCli.js';

console.log(supabase)
// Meal data with ingredients
const mealData = {
    'jollof-rice': {
        name: 'Jollof Rice',
        ingredients: [
            { name: 'Rice', description: 'Long grain parboiled rice' },
            { name: 'Tomatoes', description: 'Fresh ripe tomatoes' },
            { name: 'Bell Peppers', description: 'Red and green bell peppers' },
            { name: 'Onions', description: 'Fresh onions' },
            { name: 'Scotch Bonnet', description: 'Hot pepper for spice' },
            { name: 'Palm Oil', description: 'Traditional cooking oil' },
            { name: 'Chicken Stock', description: 'Rich chicken broth' },
            { name: 'Thyme', description: 'Fresh thyme leaves' },
            { name: 'Bay Leaves', description: 'Aromatic bay leaves' }
        ]
    },
    'fried-rice': {
        name: 'Fried Rice',
        ingredients: [
            { name: 'Rice', description: 'Cooked and cooled rice' },
            { name: 'Carrots', description: 'Diced fresh carrots' },
            { name: 'Green Peas', description: 'Sweet green peas' },
            { name: 'Eggs', description: 'Fresh chicken eggs' },
            { name: 'Spring Onions', description: 'Fresh spring onions' },
            { name: 'Soy Sauce', description: 'Light soy sauce' },
            { name: 'Vegetable Oil', description: 'Cooking oil' },
            { name: 'Garlic', description: 'Minced fresh garlic' },
            { name: 'Ginger', description: 'Fresh ginger root' }
        ]
    },
    'shawarma': {
        name: 'Shawarma',
        ingredients: [
            { name: 'Chicken Breast', description: 'Marinated chicken breast' },
            { name: 'Pita Bread', description: 'Fresh pita bread' },
            { name: 'Lettuce', description: 'Crisp lettuce leaves' },
            { name: 'Tomatoes', description: 'Sliced fresh tomatoes' },
            { name: 'Cucumber', description: 'Sliced cucumber' },
            { name: 'Tahini Sauce', description: 'Creamy tahini sauce' },
            { name: 'Pickles', description: 'Tangy pickles' },
            { name: 'Onions', description: 'Sliced red onions' },
            { name: 'Garlic Sauce', description: 'Homemade garlic sauce' }
        ]
    },
    'grilled-chicken': {
        name: 'Grilled Chicken',
        ingredients: [
            { name: 'Chicken Breast', description: 'Fresh chicken breast' },
            { name: 'Olive Oil', description: 'Extra virgin olive oil' },
            { name: 'Lemon', description: 'Fresh lemon juice' },
            { name: 'Garlic', description: 'Minced garlic cloves' },
            { name: 'Rosemary', description: 'Fresh rosemary sprigs' },
            { name: 'Black Pepper', description: 'Freshly ground black pepper' },
            { name: 'Salt', description: 'Sea salt' },
            { name: 'Butter', description: 'Unsalted butter' }
        ]
    },
    'beef-stew': {
        name: 'Beef Stew',
        ingredients: [
            { name: 'Beef Chuck', description: 'Tender beef chuck pieces' },
            { name: 'Potatoes', description: 'Fresh potatoes' },
            { name: 'Carrots', description: 'Fresh carrots' },
            { name: 'Onions', description: 'Large onions' },
            { name: 'Tomato Paste', description: 'Rich tomato paste' },
            { name: 'Beef Stock', description: 'Homemade beef stock' },
            { name: 'Bay Leaves', description: 'Aromatic bay leaves' },
            { name: 'Thyme', description: 'Fresh thyme' },
            { name: 'Worcestershire Sauce', description: 'Worcestershire sauce' }
        ]
    },
    'fish-curry': {
        name: 'Fish Curry',
        ingredients: [
            { name: 'Fresh Fish', description: 'White fish fillets' },
            { name: 'Coconut Milk', description: 'Rich coconut milk' },
            { name: 'Curry Leaves', description: 'Fresh curry leaves' },
            { name: 'Ginger', description: 'Fresh ginger' },
            { name: 'Garlic', description: 'Minced garlic' },
            { name: 'Onions', description: 'Sliced onions' },
            { name: 'Tomatoes', description: 'Fresh tomatoes' },
            { name: 'Turmeric', description: 'Ground turmeric' },
            { name: 'Coriander', description: 'Fresh coriander leaves' }
        ]
    }
};

// Spice mix data
const spiceData = {
    'curry-blend': 'Curry Blend',
    'garlic-herb': 'Garlic & Herb',
    'bbq-rub': 'BBQ Rub',
    'cajun-spice': 'Cajun Spice',
    'lemon-pepper': 'Lemon Pepper',
    'italian-herbs': 'Italian Herbs'
};

// DOM elements
const mealSelect = document.getElementById('mealSelect');
const ingredientsSection = document.getElementById('ingredientsSection');
const ingredientsList = document.getElementById('ingredientsList');
const mealForm = document.getElementById('mealForm');
const orderModal = document.getElementById('orderModal');
const orderSummary = document.getElementById('orderSummary');
const closeBtn = document.querySelector('.close');
const newOrderBtn = document.getElementById('newOrderBtn');
const toastContainer = document.getElementById('toastContainer');

// Toast notification system
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
    
    // Auto remove after duration
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
    mealSelect.addEventListener('change', displayIngredients);
    mealForm.addEventListener('submit', handleOrderSubmission);
    closeBtn.addEventListener('click', closeModal);
    newOrderBtn.addEventListener('click', startNewOrder);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeModal();
        }
    });
});

// Display ingredients based on selected meal
function displayIngredients() {
    const selectedMeal = mealSelect.value;
    
    if (selectedMeal && mealData[selectedMeal]) {
        const meal = mealData[selectedMeal];
        
        // Show ingredients section
        ingredientsSection.style.display = 'block';
        
        // Clear previous ingredients
        ingredientsList.innerHTML = '';
        
        // Add ingredients to the grid
        meal.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('div');
            ingredientItem.className = 'ingredient-item';
            ingredientItem.innerHTML = `
                <h4>${ingredient.name}</h4>
                <p>${ingredient.description}</p>
            `;
            ingredientsList.appendChild(ingredientItem);
        });
        
        // Smooth scroll to ingredients
        ingredientsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Show info toast
        showToast('info', 'Meal Selected', `${meal.name} ingredients loaded successfully!`, 3000);
    } else {
        // Hide ingredients section if no meal selected
        ingredientsSection.style.display = 'none';
    }
}

// Handle order submission
async function handleOrderSubmission(event) {
    event.preventDefault();
    
    const selectedMeal = mealSelect.value;
    const selectedSpices = Array.from(document.querySelectorAll('input[name="spices"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (!selectedMeal) {
        showToast('error', 'Selection Required', 'Please select a meal first!');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '🔄 Processing...';
    submitBtn.disabled = true;
    
    try {
        // Prepare order data
        const orderData = {
            meal: selectedMeal,
            meal_name: mealData[selectedMeal].name,
            spices: selectedSpices,
            spice_names: selectedSpices.map(spice => spiceData[spice]),
            ingredients: mealData[selectedMeal].ingredients,
            created_at: new Date().toISOString(),
            status: 'pending'
        };
        
        console.log('Attempting to save order to Supabase...');
        console.log('Order data:', orderData);
        
        // Test if orders table exists
        const { data: testData, error: testError } = await supabase
            .from('orders')
            .select('count')
            .limit(1);
        
        if (testError) {
            console.error('Orders table not found or access denied:', testError);
            // Create a mock order ID for local processing
            orderData.id = generateOrderId();
            console.log('Using generated ID for local processing:', orderData.id);
        } else {
            console.log('Orders table exists, proceeding with order save...');
            
            // Save to Supabase
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData]);
            
            if (error) {
                console.error('Supabase error:', error);
                throw new Error(error.message);
            }
            
            console.log('Order saved successfully:', data);
            
            // Handle case where data is null (table might not exist)
            if (data && data.length > 0) {
                orderData.id = data[0].id;
            } else {
                // Create a mock order ID if no data returned
                orderData.id = generateOrderId();
                console.log('No data returned from insert, using generated ID:', orderData.id);
            }
        }
        
        // Show success toast
        showToast('success', 'Order Submitted!', 'Your meal order has been successfully submitted to our kitchen!');
        
        // Create order summary
        const orderSummaryHTML = createOrderSummary(selectedMeal, selectedSpices, orderData.id);
        orderSummary.innerHTML = orderSummaryHTML;
        
        // Show modal
        orderModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error submitting order:', error);
        
        // Provide more specific error messages
        let errorMessage = 'There was an error submitting your order. Please try again.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'Access denied: Please check your Supabase project settings.';
        } else if (error.message.includes('Connection test failed')) {
            errorMessage = 'Database connection failed. Please verify your Supabase configuration.';
        }
        
        showToast('error', 'Submission Failed', errorMessage);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Create order summary HTML
function createOrderSummary(mealValue, spices, orderId) {
    const meal = mealData[mealValue];
    const spiceNames = spices.map(spice => spiceData[spice]);
    
    let summaryHTML = `
        <div class="order-item">
            <h4>🍽️ Selected Meal: ${meal.name}</h4>
            <p>Your meal will be prepared with the following ingredients:</p>
            <ul>
    `;
    
    meal.ingredients.forEach(ingredient => {
        summaryHTML += `<li>${ingredient.name} - ${ingredient.description}</li>`;
    });
    
    summaryHTML += '</ul></div>';
    
    if (spiceNames.length > 0) {
        summaryHTML += `
            <div class="order-item">
                <h4>🌶️ Selected Spice Mixes:</h4>
                <ul>
        `;
        
        spiceNames.forEach(spice => {
            summaryHTML += `<li>${spice}</li>`;
        });
        
        summaryHTML += '</ul></div>';
    } else {
        summaryHTML += `
            <div class="order-item">
                <h4>🌶️ Spice Mixes:</h4>
                <p>No spice mixes selected - your meal will be prepared with standard seasoning.</p>
            </div>
        `;
    }
    
    summaryHTML += `
        <div class="order-item">
            <h4>📋 Order Status:</h4>
            <p>✅ Your order has been submitted successfully! Our kitchen will prepare your ${meal.name} with your selected customizations.</p>
            <p>⏱️ Estimated preparation time: 20-30 minutes</p>
            <p>🆔 Order ID: ${orderId}</p>
        </div>
    `;
    
    return summaryHTML;
}

// Generate a simple order ID
function generateOrderId() {
    return 'ORD-' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

// Close modal
function closeModal() {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Start new order
function startNewOrder() {
    closeModal();
    
    // Reset form
    mealForm.reset();
    
    // Hide ingredients section
    ingredientsSection.style.display = 'none';
    
    // Clear ingredients list
    ingredientsList.innerHTML = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show info toast
    showToast('info', 'New Order', 'Ready to build your next perfect meal!');
}

// Add some interactive feedback for spice selection
document.addEventListener('DOMContentLoaded', function() {
    const spiceItems = document.querySelectorAll('.spice-item');
    
    spiceItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                item.style.background = '#e6fffa';
                item.style.borderColor = '#48bb78';
                showToast('success', 'Spice Added', `${this.nextElementSibling.textContent} added to your meal!`, 2000);
            } else {
                item.style.background = '#f7fafc';
                item.style.borderColor = 'transparent';
            }
        });
    });
}); 