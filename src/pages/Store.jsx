// client/src/pages/Store.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  Pagination,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  Star,
  StarBorder,
  LocalOffer,
  NewReleases,
  Close,
  SportsSoccer,
  FitnessCenter,
  SportsTennis,
  SportsBasketball,
  SportsCricket,
  SportsEsports,
  SportsMma,
  SportsVolleyball,
  SportsBaseball,
  SportsGolf,
  SportsRugby,
  SportsHockey,
  DirectionsBike,
  Pool,
  TrackChanges,
  SportsKabaddi,
  SportsHandball,
  SportsMotorsports,
  SportsScore,
  Waves,
  SportsGymnastics
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Mock data for products - Enhanced with comprehensive sports equipment
const mockProducts = [
  // Cricket Equipment
  {
    id: 1,
    name: "Professional Cricket Bat",
    description: "High-quality willow cricket bat for professional players",
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    rating: 4.5,
    reviewCount: 128,
    category: "cricket",
    brand: "SG",
    inStock: true,
    new: true,
    image: "cricket-bat.jpg",
    features: ["English Willow", "Short Handle", "Lightweight", "Professional Grade"]
  },
  {
    id: 2,
    name: "Cricket Ball Leather",
    description: "Professional leather cricket ball for match play",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.3,
    reviewCount: 92,
    category: "cricket",
    brand: "Kookaburra",
    inStock: true,
    image: "cricket-ball.jpg",
    features: ["Premium Leather", "Durability", "Consistent Swing", "Professional Quality"]
  },
  {
    id: 3,
    name: "Cricket Wicket Keeping Gloves",
    description: "Professional wicket keeping gloves with superior grip",
    price: 3499,
    originalPrice: 4299,
    discount: 19,
    rating: 4.4,
    reviewCount: 76,
    category: "cricket",
    brand: "Kookaburra",
    inStock: true,
    image: "wk-gloves.jpg",
    features: ["Leather Palm", "Extra Protection", "Flexible Fingers", "Professional Grade"]
  },
  {
    id: 4,
    name: "Cricket Helmet",
    description: "Professional cricket helmet with titanium grille",
    price: 5999,
    originalPrice: 7499,
    discount: 20,
    rating: 4.6,
    reviewCount: 134,
    category: "cricket",
    brand: "Masuri",
    inStock: true,
    image: "cricket-helmet.jpg",
    features: ["Titanium Grille", "Lightweight", "Ventilation", "Adjustable Fit"]
  },
  {
    id: 5,
    name: "Cricket Pads",
    description: "Professional batting pads with enhanced protection",
    price: 4599,
    originalPrice: 5999,
    discount: 23,
    rating: 4.2,
    reviewCount: 89,
    category: "cricket",
    brand: "SG",
    inStock: true,
    image: "cricket-pads.jpg",
    features: ["Lightweight", "High Protection", "Comfortable Fit", "Durable"]
  },

  // Football Equipment
  {
    id: 6,
    name: "Football Premier League",
    description: "Premium football used in premier league matches",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    rating: 4.6,
    reviewCount: 112,
    category: "football",
    brand: "Nike",
    inStock: true,
    new: true,
    image: "football.jpg",
    features: ["FIFA Approved", "Thermally Bonded", "Consistent Flight", "Waterproof"]
  },
  {
    id: 7,
    name: "Football Boots",
    description: "Professional football boots with superior grip",
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    rating: 4.7,
    reviewCount: 203,
    category: "football",
    brand: "Adidas",
    inStock: true,
    image: "football-boots.jpg",
    features: ["Firm Ground", "Lightweight", "Enhanced Touch", "Professional Grade"]
  },
  {
    id: 8,
    name: "Football Goalkeeper Gloves",
    description: "Professional goalkeeper gloves with latex palm",
    price: 3999,
    originalPrice: 5499,
    discount: 27,
    rating: 4.5,
    reviewCount: 145,
    category: "football",
    brand: "Puma",
    inStock: true,
    image: "gk-gloves.jpg",
    features: ["Latex Palm", "Finger Protection", "Wrist Support", "Breathable"]
  },
  {
    id: 9,
    name: "Football Shin Guards",
    description: "Lightweight shin guards with ankle protection",
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    rating: 4.3,
    reviewCount: 98,
    category: "football",
    brand: "Nike",
    inStock: true,
    image: "shin-guards.jpg",
    features: ["Lightweight", "Ankle Protection", "Comfortable Fit", "Ventilated"]
  },

  // Tennis Equipment
  {
    id: 10,
    name: "Tennis Racket Pro",
    description: "Professional-grade tennis racket for advanced players",
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    rating: 4.7,
    reviewCount: 95,
    category: "tennis",
    brand: "Wilson",
    inStock: true,
    image: "tennis-racket.jpg",
    features: ["Graphite Frame", "Oversized Head", "Lightweight", "Professional Control"]
  },
  {
    id: 11,
    name: "Tennis Balls (Set of 3)",
    description: "ITF approved tennis balls for professional play",
    price: 799,
    originalPrice: 999,
    discount: 20,
    rating: 4.4,
    reviewCount: 156,
    category: "tennis",
    brand: "Wilson",
    inStock: true,
    image: "tennis-balls.jpg",
    features: ["ITF Approved", "Consistent Bounce", "Durable", "Championship Quality"]
  },
  {
    id: 12,
    name: "Tennis Shoes",
    description: "Professional tennis shoes with court grip technology",
    price: 6999,
    originalPrice: 8999,
    discount: 22,
    rating: 4.6,
    reviewCount: 187,
    category: "tennis",
    brand: "Adidas",
    inStock: true,
    image: "tennis-shoes.jpg",
    features: ["Court Grip", "Lateral Support", "Breathable", "Durable Outsole"]
  },

  // Basketball Equipment
  {
    id: 13,
    name: "Basketball Official Size",
    description: "Official size basketball for professional play",
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    rating: 4.3,
    reviewCount: 76,
    category: "basketball",
    brand: "Spalding",
    inStock: true,
    image: "basketball.jpg",
    features: ["Official Size", "Premium Leather", "Excellent Grip", "Durable"]
  },
  {
    id: 14,
    name: "Basketball Shoes",
    description: "High-top basketball shoes with ankle support",
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    rating: 4.8,
    reviewCount: 245,
    category: "basketball",
    brand: "Nike",
    inStock: true,
    new: true,
    image: "basketball-shoes.jpg",
    features: ["High-Top Design", "Ankle Support", "Court Grip", "Cushioned Sole"]
  },
  {
    id: 15,
    name: "Basketball Hoop Portable",
    description: "Adjustable portable basketball hoop for outdoor play",
    price: 14999,
    originalPrice: 18999,
    discount: 21,
    rating: 4.4,
    reviewCount: 89,
    category: "basketball",
    brand: "Lifetime",
    inStock: true,
    image: "basketball-hoop.jpg",
    features: ["Adjustable Height", "Portable Base", "Weather Resistant", "Easy Assembly"]
  },

  // Badminton Equipment
  {
    id: 16,
    name: "Professional Badminton Racket",
    description: "Lightweight badminton racket for professional play",
    price: 3499,
    originalPrice: 4499,
    discount: 22,
    rating: 4.2,
    reviewCount: 87,
    category: "badminton",
    brand: "Yonex",
    inStock: true,
    image: "badminton-racket.jpg",
    features: ["Graphite Frame", "Isometric Head", "Stiff Shaft", "Control"]
  },
  {
    id: 17,
    name: "Badminton Shuttlecocks (Pack of 10)",
    description: "Professional feather shuttlecocks for tournament play",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.5,
    reviewCount: 134,
    category: "badminton",
    brand: "Yonex",
    inStock: true,
    image: "shuttlecocks.jpg",
    features: ["Feather Construction", "Tournament Grade", "Consistent Flight", "Durable"]
  },
  {
    id: 18,
    name: "Badminton Shoes",
    description: "Lightweight badminton shoes with superior grip",
    price: 4999,
    originalPrice: 6499,
    discount: 23,
    rating: 4.6,
    reviewCount: 112,
    category: "badminton",
    brand: "Victor",
    inStock: true,
    image: "badminton-shoes.jpg",
    features: ["Non-Marking Sole", "Lightweight", "Breathable", "Court Grip"]
  },

  // Table Tennis Equipment
  {
    id: 19,
    name: "Table Tennis Table",
    description: "Professional-grade indoor table tennis table",
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    rating: 4.6,
    reviewCount: 76,
    category: "table-tennis",
    brand: "Butterfly",
    inStock: true,
    image: "table-tennis.jpg",
    features: ["Regulation Size", "Smooth Surface", "Sturdy Frame", "Easy Assembly"]
  },
  {
    id: 20,
    name: "Table Tennis Paddle Professional",
    description: "Professional table tennis paddle with rubber coating",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.7,
    reviewCount: 156,
    category: "table-tennis",
    brand: "Stiga",
    inStock: true,
    image: "tt-paddle.jpg",
    features: ["Premium Rubber", "Lightweight Handle", "Professional Grade", "ITTF Approved"]
  },
  {
    id: 21,
    name: "Table Tennis Balls (Pack of 6)",
    description: "ITTF approved 3-star table tennis balls",
    price: 399,
    originalPrice: 499,
    discount: 20,
    rating: 4.4,
    reviewCount: 203,
    category: "table-tennis",
    brand: "Butterfly",
    inStock: true,
    image: "tt-balls.jpg",
    features: ["3-Star Quality", "ITTF Approved", "Consistent Bounce", "Tournament Grade"]
  },

  // Swimming Equipment
  {
    id: 22,
    name: "Swimming Goggles Pro",
    description: "Professional swimming goggles with anti-fog coating",
    price: 799,
    originalPrice: 999,
    discount: 20,
    rating: 4.1,
    reviewCount: 65,
    category: "swimming",
    brand: "Speedo",
    inStock: true,
    image: "swimming-goggles.jpg",
    features: ["Anti-Fog", "UV Protection", "Comfortable Fit", "Leak Proof"]
  },
  {
    id: 23,
    name: "Swimming Cap",
    description: "Silicone swimming cap for competitive swimming",
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.3,
    reviewCount: 89,
    category: "swimming",
    brand: "Speedo",
    inStock: true,
    image: "swim-cap.jpg",
    features: ["Silicone Material", "Hydrodynamic", "Comfortable Fit", "Durable"]
  },
  {
    id: 24,
    name: "Swimming Fins",
    description: "Training fins for improved swimming technique",
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    rating: 4.4,
    reviewCount: 134,
    category: "swimming",
    brand: "Arena",
    inStock: true,
    image: "swim-fins.jpg",
    features: ["Flexible Material", "Training Aid", "Comfortable Fit", "Technique Improvement"]
  },

  // Golf Equipment
  {
    id: 25,
    name: "Golf Club Set",
    description: "Complete golf club set for beginners to intermediate players",
    price: 24999,
    originalPrice: 34999,
    discount: 29,
    rating: 4.5,
    reviewCount: 128,
    category: "golf",
    brand: "Callaway",
    inStock: true,
    new: true,
    image: "golf-clubs.jpg",
    features: ["Complete Set", "Graphite Shafts", "Premium Grips", "Carry Bag"]
  },
  {
    id: 26,
    name: "Golf Balls (Pack of 12)",
    description: "Professional golf balls with advanced dimple design",
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    rating: 4.6,
    reviewCount: 178,
    category: "golf",
    brand: "Titleist",
    inStock: true,
    image: "golf-balls.jpg",
    features: ["Advanced Dimples", "Long Distance", "Soft Feel", "Professional Grade"]
  },

  // Boxing Equipment
  {
    id: 27,
    name: "Boxing Gloves",
    description: "Professional boxing gloves with superior wrist support",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    rating: 4.4,
    reviewCount: 103,
    category: "boxing",
    brand: "Everlast",
    inStock: true,
    image: "boxing-gloves.jpg",
    features: ["Padded Impact", "Wrist Support", "Breathable", "Durable"]
  },
  {
    id: 28,
    name: "Boxing Heavy Bag",
    description: "Heavy duty punching bag for training",
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    rating: 4.6,
    reviewCount: 87,
    category: "boxing",
    brand: "Everlast",
    inStock: true,
    image: "heavy-bag.jpg",
    features: ["Heavy Duty", "Chain Included", "Durable Material", "Training Grade"]
  },

  // Running/Fitness Equipment
  {
    id: 29,
    name: "Athletic Running Shoes",
    description: "Lightweight running shoes for professional athletes",
    price: 5499,
    originalPrice: 7499,
    discount: 27,
    rating: 4.8,
    reviewCount: 324,
    category: "running",
    brand: "Adidas",
    inStock: true,
    new: true,
    image: "running-shoes.jpg",
    features: ["Lightweight", "Cushioned Sole", "Breathable", "Durable"]
  },
  {
    id: 30,
    name: "Yoga Premium Mat",
    description: "Non-slip premium yoga mat for all types of yoga",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.4,
    reviewCount: 203,
    category: "fitness",
    brand: "Reebok",
    inStock: true,
    image: "yoga-mat.jpg",
    features: ["Extra Thick", "Non-Slip", "Eco-Friendly", "Lightweight"]
  },
  {
    id: 31,
    name: "Dumbbells Set",
    description: "Adjustable dumbbell set for home gym",
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    rating: 4.5,
    reviewCount: 156,
    category: "fitness",
    brand: "PowerBlock",
    inStock: true,
    image: "dumbbells.jpg",
    features: ["Adjustable Weight", "Space Saving", "Quick Change", "Durable"]
  },

  // Volleyball Equipment
  {
    id: 32,
    name: "Volleyball Official",
    description: "Official volleyball for indoor and outdoor play",
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    rating: 4.4,
    reviewCount: 98,
    category: "volleyball",
    brand: "Mikasa",
    inStock: true,
    image: "volleyball.jpg",
    features: ["Official Size", "Synthetic Leather", "Excellent Grip", "Durable"]
  },
  {
    id: 33,
    name: "Volleyball Net",
    description: "Professional volleyball net for court setup",
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    rating: 4.5,
    reviewCount: 76,
    category: "volleyball",
    brand: "Spalding",
    inStock: true,
    image: "volleyball-net.jpg",
    features: ["Official Height", "Durable Material", "Easy Setup", "Weather Resistant"]
  },

  // Hockey Equipment
  {
    id: 34,
    name: "Hockey Stick",
    description: "Professional field hockey stick for advanced players",
    price: 3999,
    originalPrice: 5299,
    discount: 25,
    rating: 4.3,
    reviewCount: 87,
    category: "hockey",
    brand: "Grays",
    inStock: true,
    image: "hockey-stick.jpg",
    features: ["Carbon Fiber", "Lightweight", "Enhanced Control", "Professional Grade"]
  },

  // Baseball Equipment
  {
    id: 35,
    name: "Baseball Bat",
    description: "Professional baseball bat with balanced swing",
    price: 6999,
    originalPrice: 8999,
    discount: 22,
    rating: 4.6,
    reviewCount: 145,
    category: "baseball",
    brand: "Louisville Slugger",
    inStock: true,
    image: "baseball-bat.jpg",
    features: ["Wood Construction", "Balanced Swing", "Professional Grade", "Durable"]
  },
  {
    id: 36,
    name: "Baseball Glove",
    description: "Professional baseball glove with premium leather",
    price: 4999,
    originalPrice: 6499,
    discount: 23,
    rating: 4.7,
    reviewCount: 178,
    category: "baseball",
    brand: "Rawlings",
    inStock: true,
    image: "baseball-glove.jpg",
    features: ["Premium Leather", "Perfect Fit", "Professional Grade", "Durable"]
  },

  // Archery Equipment
  {
    id: 37,
    name: "Compound Bow",
    description: "Professional compound bow for precision archery",
    price: 24999,
    originalPrice: 32999,
    discount: 24,
    rating: 4.8,
    reviewCount: 89,
    category: "archery",
    brand: "Hoyt",
    inStock: true,
    new: true,
    image: "compound-bow.jpg",
    features: ["Precision Engineering", "Adjustable Draw", "Professional Grade", "Tournament Ready"]
  },
  {
    id: 38,
    name: "Archery Arrows (Set of 12)",
    description: "Carbon fiber arrows for competitive archery",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.6,
    reviewCount: 145,
    category: "archery",
    brand: "Easton",
    inStock: true,
    image: "arrows.jpg",
    features: ["Carbon Fiber", "Precision Fletched", "Competition Grade", "Consistent Flight"]
  },

  // Bowling Equipment
  {
    id: 39,
    name: "Professional Bowling Ball",
    description: "High-performance bowling ball for strikes",
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    rating: 4.7,
    reviewCount: 156,
    category: "bowling",
    brand: "Storm",
    inStock: true,
    image: "bowling-ball.jpg",
    features: ["Reactive Resin", "Perfect Balance", "Professional Weight", "Superior Hook"]
  },
  {
    id: 40,
    name: "Bowling Shoes",
    description: "Professional bowling shoes with sliding sole",
    price: 4999,
    originalPrice: 6499,
    discount: 23,
    rating: 4.5,
    reviewCount: 198,
    category: "bowling",
    brand: "Dexter",
    inStock: true,
    image: "bowling-shoes.jpg",
    features: ["Sliding Sole", "Comfortable Fit", "Durable Construction", "Professional Grade"]
  },

  // Cycling Equipment
  {
    id: 41,
    name: "Mountain Bike Helmet",
    description: "Lightweight mountain bike helmet with ventilation",
    price: 3499,
    originalPrice: 4599,
    discount: 24,
    rating: 4.6,
    reviewCount: 187,
    category: "cycling",
    brand: "Giro",
    inStock: true,
    image: "bike-helmet.jpg",
    features: ["Lightweight", "Ventilation System", "Adjustable Fit", "Safety Certified"]
  },
  {
    id: 42,
    name: "Cycling Gloves",
    description: "Padded cycling gloves for comfort and grip",
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    rating: 4.4,
    reviewCount: 134,
    category: "cycling",
    brand: "Pearl Izumi",
    inStock: true,
    image: "cycling-gloves.jpg",
    features: ["Padded Palm", "Breathable", "Secure Grip", "Comfortable Fit"]
  },

  // Wrestling Equipment
  {
    id: 43,
    name: "Wrestling Shoes",
    description: "Lightweight wrestling shoes with ankle support",
    price: 6999,
    originalPrice: 8999,
    discount: 22,
    rating: 4.7,
    reviewCount: 203,
    category: "wrestling",
    brand: "Asics",
    inStock: true,
    image: "wrestling-shoes.jpg",
    features: ["Ankle Support", "Lightweight", "Superior Grip", "Flexible Sole"]
  },
  {
    id: 44,
    name: "Wrestling Singlet",
    description: "Professional wrestling singlet for competition",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    rating: 4.5,
    reviewCount: 156,
    category: "wrestling",
    brand: "Cliff Keen",
    inStock: true,
    image: "wrestling-singlet.jpg",
    features: ["Moisture Wicking", "Flexible Fit", "Durable Material", "Competition Legal"]
  },

  // Track & Field Equipment
  {
    id: 45,
    name: "Track Spikes",
    description: "Professional track spikes for sprinting",
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    rating: 4.8,
    reviewCount: 245,
    category: "track-field",
    brand: "Nike",
    inStock: true,
    new: true,
    image: "track-spikes.jpg",
    features: ["Sprint Spikes", "Lightweight", "Superior Traction", "Professional Grade"]
  },
  {
    id: 46,
    name: "Shot Put",
    description: "Official weight shot put for track and field",
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    rating: 4.4,
    reviewCount: 87,
    category: "track-field",
    brand: "Gill Athletics",
    inStock: true,
    image: "shot-put.jpg",
    features: ["Official Weight", "Perfect Balance", "Competition Grade", "Durable Finish"]
  },

  // Water Sports Equipment
  {
    id: 47,
    name: "Surfboard",
    description: "Professional surfboard for advanced surfers",
    price: 34999,
    originalPrice: 44999,
    discount: 22,
    rating: 4.7,
    reviewCount: 123,
    category: "water-sports",
    brand: "Rip Curl",
    inStock: true,
    image: "surfboard.jpg",
    features: ["Fiberglass Construction", "Balanced Shape", "Professional Grade", "Wave Performance"]
  },
  {
    id: 48,
    name: "Life Jacket",
    description: "Coast Guard approved life jacket for water safety",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.6,
    reviewCount: 178,
    category: "water-sports",
    brand: "O'Neill",
    inStock: true,
    image: "life-jacket.jpg",
    features: ["Coast Guard Approved", "Comfortable Fit", "Buoyant Material", "Safety Certified"]
  }
];

// Category icons mapping
const categoryIcons = {
  cricket: SportsCricket,
  football: SportsSoccer,
  tennis: SportsTennis,
  basketball: SportsBasketball,
  badminton: SportsScore,
  fitness: FitnessCenter,
  running: SportsGymnastics,
  swimming: Waves,
  golf: SportsGolf,
  "table-tennis": SportsScore,
  boxing: SportsMma,
  rugby: SportsRugby,
  hockey: SportsHockey,
  volleyball: SportsVolleyball,
  baseball: SportsBaseball,
  esports: SportsEsports,
  archery: TrackChanges,
  bowling: SportsScore,
  cycling: DirectionsBike,
  wrestling: SportsKabaddi,
  "track-field": TrackChanges,
  "water-sports": Pool
};

// Store component
const Store = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 80000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Initialize products
  useEffect(() => {
    setLoading(false);
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

  // Filter and sort products
  useEffect(() => {
    setLoading(true);

    // Initialize with a small delay to simulate loading
    const timer = setTimeout(() => {
      let result = [...products];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (selectedCategory && selectedCategory !== 'All') {
        result = result.filter(product => product.category === selectedCategory);
      }

      // Apply price range filter
      result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
          break;
        case 'discount':
          result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        case 'popularity':
        default:
          result.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }

      setFilteredProducts(result);
      setLoading(false);
      setCurrentPage(1); // Reset to first page when filters change
    }, 300); // Small delay to show loading state

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/store/product/${productId}`);
  };

  // Render star rating
  const renderRating = (rating) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <IconButton key={i} size="small" sx={{ p: 0.2, color: theme.palette.warning.main }}>
            {i < Math.floor(rating) ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
          </IconButton>
        ))}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {rating} ({Math.floor(Math.random() * 200) + 50})
        </Typography>
      </Box>
    );
  };

  // Render product card
  const renderProductCard = (product) => (
    <Card
      key={product.id}
      sx={{
        minHeight: 420,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
        cursor: 'pointer',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden'
      }}
      onClick={() => handleProductClick(product.id)}
    >
      {/* Discount Badge */}
      {product.discount && (
        <Chip
          icon={<LocalOffer />}
          label={`${product.discount}% OFF`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            fontWeight: 'bold'
          }}
        />
      )}

      {/* New Badge */}
      {product.new && (
        <Chip
          icon={<NewReleases />}
          label="NEW"
          color="success"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            fontWeight: 'bold'
          }}
        />
      )}

      {/* Product Image */}
      <CardMedia
        component="div"
        sx={{
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          position: 'relative'
        }}
        title={product.name}
      >
        <Box
          component="img"
          src={`/images/${product.image}`}
          alt={product.name}
          sx={{
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Brand and Category */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip
            label={product.brand}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ height: 22, fontSize: '0.75rem', fontWeight: 500 }}
          />
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            icon={React.createElement(categoryIcons[product.category] || SportsSoccer, { fontSize: 'small' })}
            sx={{ height: 22, fontSize: '0.75rem', fontWeight: 500 }}
          />
        </Box>

        {/* Product Name */}
        <Typography
          variant="subtitle2"
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            mb: 0.75,
            lineHeight: 1.3,
            height: '2.6rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.name}
        </Typography>

        {/* Product Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.8rem',
            mb: 1.25,
            height: '3.2rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4
          }}
        >
          {product.description}
        </Typography>

        {/* Rating */}
        <Box sx={{ mb: 1.5 }}>
          {renderRating(product.rating)}
        </Box>

        {/* Price */}
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>
              ₹{product.price.toLocaleString()}
            </Typography>
            {product.originalPrice && product.originalPrice > product.price && (
              <Typography variant="body2" component="span" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.8rem' }}>
                ₹{product.originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{
              px: 2,
              py: 0.75,
              fontSize: '0.8rem',
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Render filter panel
  const renderFilterPanel = () => (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Filters
        </Typography>
        <IconButton onClick={() => setShowFilters(false)}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Search */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Category
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Price Range
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            sx={{ width: '45%' }}
            InputProps={{ inputProps: { min: 0, max: 50000 } }}
          />
          <Typography>-</Typography>
          <TextField
            size="small"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
            sx={{ width: '45%' }}
            InputProps={{ inputProps: { min: 0, max: 50000 } }}
          />
        </Box>
      </Box>

      {/* Sort By */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Sort By
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="discount">Highest Discount</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reset Filters */}
      <Button 
        fullWidth 
        variant="outlined" 
        color="secondary"
        onClick={() => {
          setSearchQuery('');
          setSelectedCategory('');
          setPriceRange([0, 50000]);
          setSortBy('popularity');
        }}
        sx={{ mt: 2 }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), #1a237e`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 8,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Sports Equipment Store
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Discover a wide range of professional sports equipment and gear for all your favorite sports
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/store"
              sx={{ px: 4, py: 1.5 }}
            >
              Shop Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              View Categories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Filters Sidebar - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, width: 280, position: 'sticky', top: 80, height: 'fit-content' }}>
            {renderFilterPanel()}
          </Box>

          {/* Products Grid */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Header and Filters */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Sports Equipment
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {filteredProducts.length} products found
                  </Typography>

                  {/* Mobile Filters Button */}
                  <IconButton
                    sx={{ display: { md: 'none' } }}
                    onClick={() => setShowFilters(true)}
                  >
                    <FilterList />
                  </IconButton>

                  {/* Sort Dropdown */}
                  <FormControl size="small" sx={{ display: { xs: 'none', sm: 'flex' }, minWidth: 150 }}>
                    <InputLabel id="sort-select-label">Sort By</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <Sort fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="popularity">Popularity</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="newest">Newest First</MenuItem>
                      <MenuItem value="discount">Highest Discount</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Search Bar */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    maxWidth: { xs: '100%', md: 400 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Mobile Product Count */}
                <Typography variant="body2" sx={{ display: { xs: 'block', sm: 'none' }, color: 'text.secondary' }}>
                  {filteredProducts.length} products
                </Typography>
              </Box>
            </Box>

            {/* Quick Filter Chips */}
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center', fontWeight: 500 }}>
                Quick Filters:
              </Typography>
              {['All', 'cricket', 'football', 'basketball', 'tennis', 'fitness', 'running'].map((category) => (
                <Chip
                  key={category}
                  label={category === 'All' ? 'All Sports' : category.charAt(0).toUpperCase() + category.slice(1)}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  variant={selectedCategory === (category === 'All' ? '' : category) ? 'filled' : 'outlined'}
                  color="primary"
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>

            {/* Products Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Loading products...
                </Typography>
              </Box>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <>
                    <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                      {filteredProducts.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      ).map(renderProductCard)}
                    </Grid>

                    {/* Pagination */}
                    {filteredProducts.length > itemsPerPage && (
                      <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
                        <Pagination
                          count={Math.ceil(filteredProducts.length / itemsPerPage)}
                          page={currentPage}
                          onChange={(e, page) => setCurrentPage(page)}
                          color="primary"
                          size="large"
                          showFirstButton
                          showLastButton
                          sx={{
                            '& .MuiPaginationItem-root': {
                              borderRadius: 2,
                              fontWeight: 500
                            }
                          }}
                        />
                      </Stack>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                      No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Try adjusting your filters or search terms
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setPriceRange([0, 50000]);
                        setSortBy('popularity');
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear All Filters
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Filters Drawer - Mobile */}
      <Drawer
        anchor="right"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {renderFilterPanel()}
      </Drawer>

      {/* Newsletter Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          py: 6,
          mt: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexWrap: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                Get Exclusive Offers
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Subscribe to our newsletter and be the first to know about new products and special offers
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your email"
                size="small"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Store;
