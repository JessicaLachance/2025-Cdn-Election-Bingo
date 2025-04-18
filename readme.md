# Canadian Election Night Bingo

An interactive web application that generates random bingo cards for Canadian federal election night viewing parties. Mark off boxes as events occur during election night coverage!

![Canadian Election Night Bingo Preview](https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/icons/check-square-fill.svg)

## Features

- Randomly generated bingo cards from 125 Canadian election events
- Interactive marking of bingo spaces as events occur
- Free space in the center with a ballot icon
- **NEW!** Bootstrap-powered responsive design that works beautifully on all devices
- **NEW!** Enhanced UI with Canadian-themed color palette
- **NEW!** Improved winner celebration animations and modal dialogs
- Option to generate new cards or reset current card
- Winner celebration animation when a bingo is achieved

## How to Use

1. Visit the [Canadian Election Bingo website](https://jessicalachance.github.io/2025-Cdn-Election-Bingo/)
2. A random 5x5 bingo card will be generated with election night events
3. As you watch election coverage, click/tap on a square when the event occurs
4. Get 5 in a row (horizontally, vertically, or diagonally) to win!
5. Click "New Card" to generate a fresh bingo card, or "Reset Marks" to clear your current card

## Technologies Used

- HTML5, CSS3, and JavaScript
- Bootstrap 5 for responsive design and UI components
- Canvas Confetti for winner celebrations
- Bootstrap Icons for visual elements

## Local Development

To run the project locally:

```bash
git clone https://jessicalachance.github.io/2025-Cdn-Election-Bingo/
cd canadian-election-bingo
# Open index.html in your browser
```

## Project Structure

```
canadian-election-bingo/
├── index.html              # Main HTML file
├── css/
│   └── bootstrap-styles.css # Custom Bootstrap-enhanced styles
├── js/
│   ├── bootstrap-script.js  # Enhanced JavaScript with Bootstrap integration
│   └── events.js           # Canadian election events data
└── README.md               # Project documentation
```

## Mobile Responsiveness Improvements

The application has been redesigned with a focus on mobile responsiveness:

- **Fluid Grid Layout:** Automatically adjusts to different screen sizes
- **Optimized Touch Targets:** Larger buttons and interactive elements for mobile users
- **Responsive Typography:** Text sizes adjust based on device viewport
- **Stacked Controls:** Button layouts reorganize on smaller screens
- **Bootstrap Breakpoints:** Uses standard Bootstrap breakpoints for consistent behavior

## UI/UX Enhancements

The Bootstrap integration has improved the user experience in several ways:

- **Card-Based Design:** Content is organized in clean card containers
- **Modern Modal Dialogs:** Replaces custom modal implementation with Bootstrap's accessible modals
- **Enhanced Typography:** Improved readability with Bootstrap's typography system
- **Consistent Spacing:** Standardized margin and padding using Bootstrap's spacing utilities
- **Visual Feedback:** Hover and active states provide better user feedback
- **Focus States:** Improved keyboard navigation and accessibility
- **Canadian Colors:** Themed with official Canadian colors (primarily red and white)

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- These webpages and events were originally generated using Claude 3.7 Sonnet, with modifications
- Bootstrap framework for responsive design components
- Canvas Confetti library for winner celebrations
- This project is intended as a non-partisan and lighthearted way to practice coding with AI