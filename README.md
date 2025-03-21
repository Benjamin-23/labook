📚 Library and Book Store Inventory System

video: https://www.loom.com/share/bcf9459eb0f04acc8b9fc7954f7c96e8?sid=f60df7b1-ea2c-471e-9fcb-98554067089a

A comprehensive software solution for managing the tracking, cataloging, and circulation of books in libraries and bookstores. This system handles inventory control, lending/purchasing operations, and sales management efficiently.

🚀 Features
Inventory Management

Book Cataloging: Add, edit, and remove books with detailed metadata
Real-time Inventory Tracking: Monitor stock levels with automatic updates
ISBN Integration: Quick scanning and identification of books
Categorization & Tagging: Organize books by genre, author, publisher, etc.

Circulation Management

Lending System: Track borrowed books, due dates, and user history
Reservation System: Allow users to reserve books that are currently checked out
Late Fee Calculation: Automatic calculation of overdue fees
Return Processing: Streamlined check-in procedures

Sales Management


Point of Sale (POS): Process book sales and payments
Discount Management: Apply promotional offers and discounts
Sales Reporting: Generate reports on sales performance and trends
Customer Management: Track customer purchases and preferences

### Admin Dashboard
<img src="public/sign-in.png" alt="Sales" />
<img src="public/admindashboard.png" alt="Sales" />
<img src="public/addUser.png" alt="Sales" />
<img src="public/addBook.png" alt="Sales" />
<img src="public/booklist.png" alt="Sales" />
<img src="public/loans.png" alt="Sales" />



##User Interface

Admin Dashboard: Comprehensive management interface
Customer Portal: User-friendly interface for browsing and account management
Search Functionality: Advanced search with filters and recommendations
Responsive Design: Accessible on both desktop and mobile devices

📱 Customer Screen

Borrowed Books View:
- Display list of currently borrowed books with:
  * Book title and author
  * Due dates and remaining days
  * Option to extend borrowing period
  * Return status and late fees if applicable
- Historical view of previously borrowed books
- Filter and sort capabilities by date, title, author
- Digital receipt downloads

Available Books Catalog:
- Grid/List view of all available books showing:
  * Cover image and basic details
  * Current availability status
  * Location in library/store
  * Option to reserve if checked out
- Advanced filtering by:
  * Genre, author, publisher
  * Rating and popularity
  * New arrivals and featured books
- Personalized recommendations based on borrowing history
- Quick search with auto-complete

### customer screen
 <img src="public/customerAdmin.png" alt="Sales" />


🛠️ Tech Stack

Frontend: Next.js - React framework for server-rendered applications
UI Components: shadcn/ui - Beautifully designed components
Backend & Database: Supabase - Open source Firebase alternative with:

PostgreSQL database
Authentication
Real-time subscriptions
Storage solutions



📋 Prerequisites

Node.js (v19.0+)
`npm or yarn`
Supabase account

🔧 Installation

Clone the repository:

git@github.com:Benjamin-23/labook.git
cd labook

Install dependencies:

`npm install`
`yarn install`

Set up environment variables:
Create a .env.local file with the following variables:

`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
`NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

Run the development server:

`npm run dev`
`yarn dev`

Open http://localhost:3000 in your browser to see the application.

🗄️ Database Schema
The system uses the following core tables in Supabase:

-books: Stores book information (title, author, ISBN, etc.)
-inventory: Tracks quantity and status of each book
-users: Customer and staff information
-transactions: Records of sales and lending activities
-categories: Book classifications and genres
-loans: Records of book loans and returns
-purchase_item: Records of book purchases.


🚀 Deployment
This application can be deployed using Vercel for the frontend and continuing to use Supabase for the backend:
`npm run build`
`yarn build`

📈 Future Enhancements

Mobile app using React Native
Integration with payment gateways
AI-powered book recommendations
Advanced analytics dashboard
Email notification system

📝 License
MIT
👥 Contributors

 Benjamin Kitonga

🙏 Acknowledgements

Next.js Documentation
Supabase Documentation
shadcn/ui Documentation
