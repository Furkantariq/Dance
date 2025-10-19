# Dance Battle - Short-Form Dance Competition App

A React Native mobile application prototype for a short-form dance competition platform built with Expo, TypeScript, React-Query, Supabase, and Tailwind CSS.

## 🎯 Project Overview

Dance Battle is a TikTok-style mobile application that allows users to participate in dance competitions by uploading and viewing dance videos. The app features a vertical video feed, user authentication, leaderboards, and real-time scoring.

## 🚀 Features

### Core Functionality
- **User Authentication**: Registration and login with email/password
- **Video Feed**: Vertical scrolling feed with external video URLs
- **Leaderboard**: Real-time competition rankings with scores
- **User Profiles**: Personal profiles with stats and settings
- **Video Interactions**: Like, comment, and share functionality

### Technical Features
- **React Native + Expo**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React-Query**: Efficient data fetching and caching
- **Supabase**: Backend-as-a-Service for authentication and database
- **Tailwind CSS**: Utility-first styling with NativeWind
- **Video Streaming**: External video URL handling with Expo AV

## 🛠 Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **State Management**: React-Query (@tanstack/react-query)
- **Backend**: Supabase
- **Navigation**: Expo Router
- **Video**: Expo AV
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons

## 📱 App Structure

```
app/
├── _layout.tsx              # Root layout with React Query provider
├── index.tsx                # Authentication flow handler
├── auth/
│   ├── login.tsx           # Login screen
│   └── register.tsx        # Registration screen
└── (tabs)/
    ├── _layout.tsx         # Tab navigation layout
    ├── index.tsx           # Video feed screen
    ├── leaderboard.tsx     # Leaderboard screen
    └── profile.tsx         # User profile screen

components/
├── ui/
│   ├── Button.tsx          # Reusable button component
│   └── Input.tsx           # Reusable input component

hooks/
├── useAuth.ts              # Authentication hooks
├── useVideos.ts            # Video data management
└── useLeaderboard.ts       # Leaderboard data management

lib/
├── supabase.ts             # Supabase client and types
└── queryClient.ts          # React Query configuration

constants/
└── theme.ts                # App theme and styling constants
```

## 🏗 Architecture & Design Patterns

### 1. **Component Architecture**
- **Atomic Design**: Reusable UI components in `components/ui/`
- **Screen Components**: Feature-specific screens in `app/` directory
- **Custom Hooks**: Business logic separation in `hooks/`

### 2. **State Management**
- **React-Query**: Server state management with caching and synchronization
- **Local State**: React hooks for component-level state
- **Authentication State**: Centralized auth state with custom hooks

### 3. **Data Flow**
```
Supabase Database → React-Query → Custom Hooks → Components
```

### 4. **Type Safety**
- **TypeScript Interfaces**: Comprehensive type definitions
- **Supabase Types**: Auto-generated database types
- **Component Props**: Typed component interfaces

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dance-battle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `lib/supabase.ts` with your credentials:
   ```typescript
   const supabaseUrl = 'your-project-url';
   const supabaseAnonKey = 'your-anon-key';
   ```

4. **Configure Supabase Database**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     username TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Videos table
   CREATE TABLE videos (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     video_url TEXT NOT NULL,
     thumbnail_url TEXT,
     duration INTEGER DEFAULT 0,
     likes_count INTEGER DEFAULT 0,
     views_count INTEGER DEFAULT 0,
     score DECIMAL(5,2) DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Leaderboard view
   CREATE VIEW leaderboard AS
   SELECT 
     v.id,
     v.user_id,
     v.id as video_id,
     v.score,
     ROW_NUMBER() OVER (ORDER BY v.score DESC) as rank,
     u.*,
     v.title as video_title,
     v.likes_count,
     v.views_count
   FROM videos v
   JOIN users u ON v.user_id = u.id
   ORDER BY v.score DESC;
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🎨 Styling & UI/UX

### Design System
- **Color Palette**: Purple primary theme with gray accents
- **Typography**: System fonts with consistent sizing
- **Spacing**: Tailwind's spacing scale for consistency
- **Components**: Reusable UI components with variants

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile screens
- **Touch Interactions**: Proper touch targets and feedback
- **Performance**: Optimized video loading and smooth scrolling
- **Accessibility**: Proper contrast ratios and semantic markup

## 🔧 Development Guidelines

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Expo configuration
- **Component Structure**: Consistent component organization
- **Error Handling**: Comprehensive error boundaries and handling

### Best Practices
- **Custom Hooks**: Business logic separation
- **React-Query**: Efficient data fetching patterns
- **Performance**: Memoization and optimization techniques
- **Security**: Secure authentication and data handling

## 📊 Data Management

### Mock Data Strategy
For demonstration purposes, the app uses mock data with external video URLs:
- **Video URLs**: Google's sample video library
- **User Data**: Generated mock user profiles
- **Scores**: Simulated competition scores

### Real Implementation
In production, the app would:
- Connect to actual Supabase database
- Handle real video uploads and storage
- Implement proper scoring algorithms
- Add real-time features with Supabase Realtime

## 🧪 Testing Strategy

### Manual Testing
- **Authentication Flow**: Login/register functionality
- **Video Playback**: External video URL handling
- **Navigation**: Tab navigation and screen transitions
- **UI/UX**: Touch interactions and visual feedback

### Future Testing
- **Unit Tests**: Component and hook testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user flow testing with Detox

## 🚀 Deployment

### Development
- **Expo Go**: Test on physical devices
- **Simulators**: iOS and Android development

### Production
- **Expo Application Services (EAS)**: Build and deployment
- **App Store**: iOS App Store distribution
- **Google Play**: Android Play Store distribution

## 🤝 Team Collaboration

### Development Workflow
- **Git Flow**: Feature branches and pull requests
- **Code Reviews**: Peer review process
- **Documentation**: Comprehensive code documentation
- **Communication**: Regular team syncs and updates

### Remote Work Considerations
- **Async Communication**: Clear documentation and comments
- **Code Standards**: Consistent coding conventions
- **Version Control**: Proper branching and commit practices
- **Testing**: Comprehensive testing before deployment

## 📈 Future Enhancements

### Phase 2 Features
- **Video Upload**: Real video upload functionality
- **Real-time Chat**: In-app messaging system
- **Push Notifications**: Competition updates and alerts
- **Social Features**: Follow/unfollow functionality

### Technical Improvements
- **Offline Support**: Offline video caching
- **Performance**: Video optimization and compression
- **Analytics**: User behavior tracking
- **A/B Testing**: Feature experimentation

## 📝 License

This project is created for demonstration purposes as part of a competency assessment.

## 👨‍💻 Developer Notes

### Key Decisions
1. **External Video URLs**: Used for demonstration to avoid large file sizes
2. **Mock Data**: Implemented for quick prototyping and testing
3. **Tailwind CSS**: Chosen for rapid development and consistency
4. **React-Query**: Selected for efficient data management and caching

### Challenges Solved
1. **Video Performance**: Optimized video loading and playback
2. **State Management**: Efficient data synchronization across screens
3. **Type Safety**: Comprehensive TypeScript implementation
4. **Mobile UX**: Smooth scrolling and touch interactions

### Learning Outcomes
- **React Native**: Advanced mobile development patterns
- **Expo**: Modern development workflow and tooling
- **TypeScript**: Type-safe development practices
- **React-Query**: Modern data fetching and caching
- **Supabase**: Backend-as-a-Service integration
- **Mobile Design**: User experience optimization

---

**Built with ❤️ using React Native, Expo, and modern web technologies**