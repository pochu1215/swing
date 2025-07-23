# Cursor AI IDE Rules for Benji Bananas Web Clone Development

## Core Development Principles

### 1. **Strict Design Document Adherence**
- All development MUST follow the `DESIGN_DOCUMENT.md` specifications
- Implement features in milestone order: Canvas → Physics → Procedural Generation → UI → Polish
- Never deviate from core mechanics: pendulum physics, procedural jungle generation, vanilla JavaScript + HTML5 Canvas
- No external libraries unless explicitly approved (custom physics code is acceptable)

### 2. **Step-by-Step Implementation Strategy**
- Complete each implementation step fully before proceeding to the next
- Test each step in isolation (e.g., player movement before vine interaction)
- Follow code snippets and Cursor Tips provided in the guide
- Validate functionality matches the source video gameplay expectations

### 3. **Code Quality and Standards**

#### Variable Naming Convention
- Use **camelCase** for JavaScript variables and functions (standard convention)
- Examples: `gameRunning`, `worldOffset`, `swingAnchor`, `handleInput()`
- Avoid all lowercase as it violates JavaScript standards and reduces readability

#### File Organization
- Keep `game.js` as the main file initially
- Split into modular files when exceeding 300-400 lines:
  - `physics.js` - Physics calculations and player movement
  - `world.js` - Procedural generation and world management  
  - `ui.js` - Menus, HUD, and user interface
  - `audio.js` - Sound effects and music management
- Maintain clear separation of concerns

#### Refactoring Requirements
- Refactor immediately after adding new features
- Extract repeated logic into helper functions (e.g., `distance()`, `collision()`)
- Eliminate code duplication before moving to next step
- Maintain clean, readable code structure

### 4. **Asset and Visual Standards**
- Start with Canvas-drawn placeholders (circles, lines, rectangles)
- Only integrate free assets from OpenGameArt after core mechanics work
- Ensure responsive design that scales to browser window
- Test visual elements on different screen sizes early

### 5. **Physics and Gameplay Tuning**
- Iteratively adjust physics constants for "fun feel":
  - Gravity: Start at 0.5, tune based on testing
  - Swing angular velocity: Adjust for realistic pendulum motion
  - Collision detection: Ensure precise but forgiving hit boxes
- Test against source video for authentic gameplay feel
- Prioritize game feel over physics accuracy

### 6. **Performance and Optimization**

#### Target Specifications
- 60 FPS using `requestAnimationFrame`
- Optimize after each milestone completion
- Implement object pooling for vines, bananas, obstacles in Step 4
- Monitor performance on multiple browsers (Chrome, Firefox, Safari)

#### Mobile Considerations
- Touch-first design approach
- Test responsiveness on mobile devices
- Ensure tap targets are appropriately sized (minimum 44px)
- Optimize for both portrait and landscape orientations

### 7. **Testing and Quality Assurance**

#### Local Testing Requirements
- Test each feature immediately after implementation
- Create comprehensive console logging:
  - Player position and state changes
  - Collision events and outcomes
  - Vine generation and removal
  - Score and banana collection events
- Simulate automated testing through console logs
- Verify functionality across different browsers

#### Browser MCP Testing Integration
- **Use Browser MCP for comprehensive testing workflow:**
  - **Mandatory 2-Run Test:** After each deployment, perform at least two full gameplay loops (from start to "Game Over!") to test stability and consistency.
  - **Validate Test Runs with Console Logs:** All test runs must be accompanied by console logs showing key game events (e.g., score, state changes, vines grabbed) to provide verifiable proof of the test outcome.
  - Navigate to live game URL during development
  - Take screenshots for visual regression testing
  - Test touch interactions using browser dev tools
  - Inspect console logs for errors in real browser environment
  - Validate mobile responsiveness using device emulation
  - Test cross-browser compatibility by navigating between different browsers
  - Capture accessibility snapshots for UI validation
  - Monitor network requests and performance metrics

#### User Acceptance Testing
- Test complete user journeys (start game → swing → collect → game over)
- Validate mobile touch interactions work correctly using Browser MCP
- Ensure keyboard controls function as specified
- Test accessibility features (color contrast, keyboard navigation)
- Use Browser MCP to test deployed versions on Vercel immediately after deployment

### 8. **UI/UX Implementation Priority**
- Implement game states system early: `menu`, `playing`, `gameOver`
- Add accessibility features during development, not as afterthought:
  - Keyboard controls (spacebar for grab/release)
  - Color-blind friendly palette
  - Clear visual feedback for interactions
- Follow the specified UI requirements: HUD, menus, tutorials

### 9. **Audio and Polish Guidelines**
- Defer audio implementation until Step 6 (after core gameplay is solid)
- Use HTML5 Audio API with placeholder assets initially
- Implement looping background music and essential SFX
- Test audio across different browsers and devices

### 10. **Development Workflow and Deployment**

#### Version Control
- **GitHub Repository**: `https://github.com/pochu1215/swing` (user: pochu1215)
- Use GitHub for version control (preferred by user)
- Create meaningful commit messages describing specific features/fixes
- Version numbering: `v2025-01-[DD]-[HH]-[MM]` (Hong Kong time)
- Use `git status` to verify completion after commits
- Push to main branch for deployment triggers

#### Deployment Process
- **Primary**: GitHub Pages for deployment (user preference) - auto-deploy from GitHub
- **Repository**: https://github.com/pochu1215/swing
- **Live URL**: https://pochu1215.github.io/swing/
- Backup: Netlify or Surge.sh for hosting
- Test deployed version on both desktop and mobile using Browser MCP
- Ensure online version matches local development environment
- Verify GitHub Pages deployment URL immediately after each push

### 11. **Windows Environment Considerations**
- **NEVER use `&&` operators** in command line operations
- Use separate commands or PowerShell semicolon syntax (`;`) when needed
- Start fresh terminal sessions for complex operations
- Handle Windows-specific path issues appropriately

### 12. **Error Handling and Recovery**
- Implement graceful error handling for:
  - Canvas rendering failures
  - Audio loading issues
  - Touch/mouse event problems
  - Browser compatibility issues
- If commands appear stuck, re-run in new terminal session
- Log errors to console for debugging
- Provide user-friendly error messages

### 13. **Documentation and Communication**
- Update this rules document as development progresses
- Document any deviations from the design document with justification
- Maintain clear comments in code for complex physics calculations
- Keep implementation notes for future reference

## Development Checkpoints

### After Each Step:
1. ✅ Code compiles and runs without errors
2. ✅ New functionality works as specified
3. ✅ Previous functionality remains intact
4. ✅ Performance remains at target FPS
5. ✅ Code is refactored and clean
6. ✅ Testing logs confirm expected behavior

### Before Moving to Next Milestone:
1. ✅ All features from current milestone are complete
2. ✅ Cross-browser testing completed
3. ✅ Mobile responsiveness verified
4. ✅ Code is properly organized and documented
5. ✅ Version committed to Git with proper messaging

---

## Quick Reference Commands

### Safe Windows Command Examples:
```bash
# Good - separate commands
git add .
git commit -m "Add player physics system"
git push

# Bad - avoid && on Windows
git add . && git commit -m "message" && git push
```

### Testing Checklist:
- [ ] Chrome desktop (Browser MCP navigation)
- [ ] Firefox desktop (Browser MCP navigation)  
- [ ] Safari (if available)
- [ ] Chrome mobile (Browser MCP device emulation)
- [ ] Touch interactions work (Browser MCP touch testing)
- [ ] Keyboard controls work
- [ ] Game states transition properly
- [ ] Performance is smooth (60 FPS)
- [ ] Screenshots captured for visual regression (Browser MCP)
- [ ] Console logs clean in live environment (Browser MCP)
- [ ] GitHub Pages deployment tested immediately (Browser MCP)

---

*This document will be updated as development progresses and new requirements emerge.* 