# Eliminacja Wartości - Life Values Ranking App

## Overview

This is a Vue.js 3 single-page application that allows users to sort and rank 40 life values through an interactive drag-and-drop interface. The primary goal is to help users identify their top 7 most important life values through an elimination/sorting process. The application features a modern, responsive design with progress tracking and data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Vue.js 3 with Composition API
- **Architecture Pattern**: Single-page application (SPA) with component-based structure
- **State Management**: Local reactive state using Vue's `ref` and `computed` APIs
- **Styling**: Custom CSS with modern design principles, gradients, and responsive layout
- **Icons**: Font Awesome 6.4.0 for visual elements

### Client-Side Only Architecture
This is a pure client-side application with no backend components. All functionality is handled in the browser using:
- HTML for structure
- CSS for styling and animations
- JavaScript (Vue.js 3) for interactivity and state management

## Key Components

### Core Application Logic (`script.js`)
- **Values Management**: Handles the list of 40 predefined life values
- **Drag and Drop System**: Implements touch and mouse-based drag-and-drop functionality
- **Progress Calculation**: Tracks sorting progress based on value positioning
- **Data Persistence**: Uses localStorage for saving/loading user progress
- **Import/Export**: CSV functionality for data portability

### User Interface (`index.html` + `style.css`)
- **Responsive Design**: Works on both desktop and mobile devices
- **Progress Visualization**: Progress bar showing sorting completion
- **Interactive Elements**: Drag-and-drop interface with visual feedback
- **Value Highlighting**: Top 7 values are subtly highlighted with yellow gradient backgrounds
- **Toast Notifications**: User feedback system for actions

### Visual Design Principles
- Modern gradient backgrounds
- Card-based layout for values
- Smooth animations and transitions
- Visual feedback during drag operations (rotation, spacing)
- Accessible color scheme with good contrast

## Data Flow

### State Management
1. **Initialization**: Load 40 predefined values, check localStorage for saved state
2. **User Interaction**: Handle drag-and-drop events to reorder values
3. **Progress Tracking**: Calculate completion percentage based on value positioning
4. **Persistence**: Auto-save to localStorage on every change
5. **Export/Import**: Allow CSV data exchange

### Drag and Drop Flow
1. User initiates drag on a value card
2. Visual feedback shows (rotation, highlighting)
3. Other cards adjust spacing to show drop zones
4. On drop, values list reorders
5. Progress recalculates
6. State persists to localStorage

## External Dependencies

### CDN Resources
- **Vue.js 3**: `https://unpkg.com/vue@3/dist/vue.global.js` - Core framework
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` - Icons

### No Backend Dependencies
- No server-side components
- No database requirements
- No authentication system
- No external APIs

## Deployment Strategy

### Static Hosting Compatible
The application consists of static files only:
- `index.html` - Main application file
- `style.css` - Styling and layout
- `script.js` - Application logic
- Can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

### Browser Requirements
- Modern browsers supporting ES6+ features
- Touch event support for mobile devices
- localStorage support for data persistence

### Mobile Optimization
- Responsive CSS design
- Touch-friendly drag and drop
- Viewport meta tag for proper mobile scaling
- Touch event handlers in addition to mouse events

## Technical Implementation Notes

### Key Features
- **40 Predefined Values**: Complete list of life values in Polish language
- **Progress Algorithm**: Smart calculation based on value positioning and top-7 identification
- **Visual Feedback**: Drag operations show clear visual cues (rotation, spacing)
- **Data Persistence**: Automatic localStorage saving/loading
- **Accessibility**: Keyboard navigation support and proper ARIA attributes
- **Export/Import**: CSV functionality for data backup and sharing

### Performance Considerations
- Lightweight single-page design
- Minimal external dependencies
- Efficient Vue.js reactive updates
- CSS animations for smooth user experience