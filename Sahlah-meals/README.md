# Build-A-Meal - Custom Meal Planner

A modern web application for building custom meals with ingredient selection and spice customization.

## Features

- **Meal Selection**: Choose from 6 different meals (Jollof Rice, Fried Rice, Shawarma, etc.)
- **Ingredient Display**: Shows detailed ingredients when a meal is selected
- **Spice Customization**: Add various spice mixes to customize your meal
- **Order Management**: Submit orders with beautiful modal summaries
- **Admin Dashboard**: Manage orders, view statistics, and update order status
- **Real-time Notifications**: Toast notifications for user feedback

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-setup.sql` to create the orders table and set up permissions
4. Copy your project URL and anon key to the `.env` file

**Quick Setup**: Copy and paste the contents of `supabase-setup.sql` into your Supabase SQL Editor and run it.

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── index.html          # Main meal builder page
├── admin.html          # Admin dashboard
├── script.js           # Main application logic
├── admin.js            # Admin dashboard logic
├── supabaseCli.js      # Supabase client configuration
├── style.css           # Main styles
└── main.js             # Vite entry point

admin-styles.css        # Admin-specific styles
package.json            # Dependencies and scripts
vite.config.js          # Vite configuration
```

## Usage

### Main Application
1. Select a meal from the dropdown
2. View the ingredients that will be used
3. Choose your preferred spice mixes
4. Submit your order
5. View the order summary

### Admin Dashboard
1. Access via the "Admin Dashboard" link
2. View all orders with filtering options
3. Update order status
4. Monitor order statistics

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with responsive design
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Module System**: ES6 Modules

## License

MIT License 