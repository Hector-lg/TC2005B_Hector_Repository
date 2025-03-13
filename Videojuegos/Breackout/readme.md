# Breakout Game

## Description
Breakout is a classic arcade game where players control a paddle to bounce a ball against a wall of bricks. The objective is to destroy all the bricks by hitting them with the ball while preventing the ball from falling off the bottom edge of the screen.

## Game Mechanics

### Core Gameplay
- **Paddle Control**: Players move a paddle horizontally at the bottom of the screen to bounce the ball upward.
- **Ball Movement**: The ball moves around the screen, bouncing off the walls, paddle, and bricks.
- **Brick Breaking**: When the ball hits a brick, the brick is destroyed and the player earns points.
- **Lives**: Players start with 3 lives. A life is lost when the ball falls below the paddle.
- **Levels**: The game becomes progressively more challenging as players advance through levels.

### Controls
- **Left Arrow Key**: Move paddle to the left
- **Right Arrow Key**: Move paddle to the right

### Scoring System
- Each brick destroyed awards points based on its type and the current level
- Base score per brick: 10 points + (level × 5)
- High scores are saved locally

### Game Elements

#### Ball
- Bounces off walls, paddle, and bricks
- Changes direction based on where it hits the paddle
- Hitting different parts of the paddle affects the ball's angle
- Speed may increase as gameplay progresses

#### Paddle
- Player-controlled horizontal platform
- Bounces the ball back into play
- Ball direction is influenced by which part of the paddle it hits

#### Bricks
- Arranged in rows and columns at the top of the screen
- Different colored bricks may have different point values
- All bricks must be destroyed to advance to the next level

## Game Customization
Players can customize their game experience with the following options:
- **Rows**: Choose the number of brick rows (1-10)
- **Columns**: Choose the number of brick columns (1-15)
- **Level**: Start at a specific level (1-5)

## Game Flow
1. Start the game by configuring settings and clicking "Comenzar" (Start)
2. Control the paddle to keep the ball in play
3. Break all bricks to advance
4. Game ends when all lives are lost
5. Your high score is recorded for future sessions

## Objective
The main objective is to break all the bricks in each level while maintaining as many lives as possible and achieving the highest score.

## Tips
- Aim for breaking multiple bricks with a single ball trajectory
- Use the edges of the paddle to direct the ball to specific areas
- Try to keep the ball above the bricks as much as possible
- Pay attention to the ball's angle when it bounces off the paddle