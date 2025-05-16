const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const CateringOrder = require('./models/cateringOrder');
const Contact = require('./models/contactOrder');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret
const bcrypt = require('bcrypt');
const Order = require('./models/orders'); // Make sure this is at the top of your file
const Reservation = require('./models/reservation'); // Add this at the top with other requires
const PrivateEventBooking = require('./models/privateEventBooking'); // Add this at the top with other requires
const DeliveryOrder = require('./models/deliveryOrder');
const TakeAwayOrder = require('./models/takeAwayOrder');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Be cautious with this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,'public')));
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database name:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
})
.catch((err) => {
  console.error('Could not connect to MongoDB', err);
});

// Check MongoDB connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);

// Handle catering order submission
app.post('/api/catering-order', async (req, res) => {
  try {
    const newOrder = new CateringOrder(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Catering order submitted successfully' });
  } catch (error) {
    console.error('Error submitting catering order:', error);
    res.status(500).json({ message: 'Error submitting catering order' });
  }
});

// Handle contact form submission
app.post('/api/contact-us', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'restaurant.html'))
});
app.get('/restaurant', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'restaurant.html'));
});
app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'menu1.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'contact.html'));
});
app.get('/catering', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'catering.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});
app.get('/reservetable', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'reservetable.html'));
});
app.get('/privateevent', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'privateevent.html'));
});
app.get('/catering_order', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'catering_order.html'));
});
app.get('/onlineorders', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'onlineorders.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'admin.html'));
});

// Add a route for the root path

app.get('/api/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Received token:', token); // Debug log

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    res.json({ valid: true, username: decoded.username });
  } catch (error) {
    console.error('Token verification error:', error); // Debug log
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Admin login route
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'y22it051' && password === 'y22it051') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Admin token verification route
app.get('/api/admin/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        res.json({ valid: true, username: decoded.username });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.json({ message: 'Database connection successful' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
});

// Routes for regular orders
app.post('/api/orders', async (req, res) => {
    try {
        console.log('Received order data:', req.body);
        const { itemName, quantity, tableNumber, price } = req.body;
        
        if (!itemName || !quantity || !tableNumber || !price) {
            throw new Error('Missing required fields');
        }
        
        const newOrder = new Order({
            itemName,
            quantity,
            tableNumber,
            price
        });

        console.log('New order object:', newOrder);

        const savedOrder = await newOrder.save();
        console.log('Order saved successfully:', savedOrder);
        res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.toString(), stack: error.stack });
    }
});

// Routes for delivery orders
app.post('/api/delivery-orders', async (req, res) => {
    try {
        console.log('Received delivery order data:', req.body);
        const { itemName, quantity, price, name, phone, address } = req.body;
        
        if (!itemName || !quantity || !price || !name || !phone || !address) {
            throw new Error('Missing required fields for delivery order');
        }
        
        const newDeliveryOrder = new DeliveryOrder({
            itemName,
            quantity,
            price,
            name,
            phone,
            address
        });

        console.log('New delivery order object:', newDeliveryOrder);

        const savedDeliveryOrder = await newDeliveryOrder.save();
        console.log('Delivery order saved successfully:', savedDeliveryOrder);
        res.status(201).json({ message: 'Delivery order placed successfully', order: savedDeliveryOrder });
    } catch (error) {
        console.error('Error placing delivery order:', error);
        res.status(500).json({ message: 'Failed to place delivery order', error: error.toString(), stack: error.stack });
    }
});

// Routes for take-away orders
app.post('/api/takeaway-orders', async (req, res) => {
    try {
        console.log('Received take-away order data:', req.body);
        const { itemName, quantity, price, name, phone, pickupTime } = req.body;
        
        if (!itemName || !quantity || !price || !name || !phone || !pickupTime) {
            throw new Error('Missing required fields for take-away order');
        }
        
        const newTakeAwayOrder = new TakeAwayOrder({
            itemName,
            quantity,
            price,
            name,
            phone,
            pickupTime
        });

        console.log('New take-away order object:', newTakeAwayOrder);

        const savedTakeAwayOrder = await newTakeAwayOrder.save();
        console.log('Take-away order saved successfully:', savedTakeAwayOrder);
        res.status(201).json({ message: 'Take-away order placed successfully', order: savedTakeAwayOrder });
    } catch (error) {
        console.error('Error placing take-away order:', error);
        res.status(500).json({ message: 'Failed to place take-away order', error: error.toString(), stack: error.stack });
    }
});

// Add this new route to handle reservations
app.post('/api/reservations', async (req, res) => {
    try {
        const { name, phone, date, time, guests, occasion } = req.body;
        
        // Generate a unique booking ID
        const bookingId = 'BK' + Date.now().toString().slice(-6);

        const newReservation = new Reservation({
            bookingId,
            name,
            phone,
            date,
            time,
            guests,
            occasion
        });

        await newReservation.save();
        res.status(201).json({ message: 'Reservation made successfully', bookingId });
    } catch (error) {
        console.error('Error making reservation:', error);
        res.status(500).json({ message: 'Failed to make reservation', error: error.message });
    }
});

// Add this new route to handle private event bookings
app.post('/api/private-event-bookings', async (req, res) => {
    try {
        const { name, phone, date, time, guests, occasion, venueName, price } = req.body;
        
        // Generate a unique booking ID
        const bookingId = 'PE' + Date.now().toString().slice(-6);

        const newBooking = new PrivateEventBooking({
            bookingId,
            name,
            phone,
            date,
            time,
            guests,
            occasion,
            venueName,
            price
        });

        await newBooking.save();
        res.status(201).json({ message: 'Private event booking made successfully', bookingId });
    } catch (error) {
        console.error('Error making private event booking:', error);
        res.status(500).json({ message: 'Failed to make private event booking', error: error.message });
    }
});

// Update these API endpoints for admin dashboard to include counts
app.get('/api/dashboard-counts', async (req, res) => {
    try {
        const counts = {
            'catering-orders': await CateringOrder.countDocuments(),
            'contacts': await Contact.countDocuments(),
            'delivery-orders': await DeliveryOrder.countDocuments(),
            'orders': await Order.countDocuments(),
            'private-event-bookings': await PrivateEventBooking.countDocuments(),
            'reservations': await Reservation.countDocuments(),
            'takeaway-orders': await TakeAwayOrder.countDocuments()
        };
        res.json(counts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard counts', error: error.message });
    }
});

// API endpoints for admin dashboard
app.get('/api/catering-orders', async (req, res) => {
    try {
        const cateringOrders = await CateringOrder.find();
        res.json(cateringOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching catering orders', error: error.message });
    }
});

app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});

app.get('/api/delivery-orders', async (req, res) => {
    try {
        const deliveryOrders = await DeliveryOrder.find();
        res.json(deliveryOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery orders', error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

app.get('/api/private-event-bookings', async (req, res) => {
    try {
        const privateEventBookings = await PrivateEventBooking.find();
        res.json(privateEventBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching private event bookings', error: error.message });
    }
});

app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
});

app.get('/api/takeaway-orders', async (req, res) => {
    try {
        const takeawayOrders = await TakeAwayOrder.find();
        res.json(takeawayOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching takeaway orders', error: error.message });
    }
});

// Update these routes for completing and deleting orders
app.post('/api/:category/:id/complete', async (req, res) => {
    try {
        const { category, id } = req.params;
        let Model;
        switch (category) {
            case 'catering-orders':
                Model = CateringOrder;
                break;
            case 'contacts':
                Model = Contact;
                break;
            case 'delivery-orders':
                Model = DeliveryOrder;
                break;
            case 'orders':
                Model = Order;
                break;
            case 'private-event-bookings':
                Model = PrivateEventBooking;
                break;
            case 'reservations':
                Model = Reservation;
                break;
            case 'takeaway-orders':
                Model = TakeAwayOrder;
                break;
            default:
                throw new Error('Invalid category');
        }
        const result = await Model.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.json({ success: true, message: 'Item completed and removed successfully' });
    } catch (error) {
        console.error('Error completing item:', error);
        res.status(500).json({ success: false, message: 'Failed to complete item', error: error.toString() });
    }
});

app.delete('/api/:category/:id', async (req, res) => {
    try {
        const { category, id } = req.params;
        let Model;
        switch (category) {
            case 'catering-orders':
                Model = CateringOrder;
                break;
            case 'contacts':
                Model = Contact;
                break;
            case 'delivery-orders':
                Model = DeliveryOrder;
                break;
            case 'orders':
                Model = Order;
                break;
            case 'private-event-bookings':
                Model = PrivateEventBooking;
                break;
            case 'reservations':
                Model = Reservation;
                break;
            case 'takeaway-orders':
                Model = TakeAwayOrder;
                break;
            default:
                throw new Error('Invalid category');
        }
        const result = await Model.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ success: false, message: 'Failed to delete item', error: error.toString() });
    }
});

// Keep the catch-all route at the very end
app.use((req, res) => {
    console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).send('404 - Not Found');
});