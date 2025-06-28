# Plan Detallado de Desarrollo: Plataforma Educativa RPG Inmersiva

## Introducción y Visión Técnica

Este documento proporciona un plan técnico exhaustivo para el desarrollo de una plataforma educativa inmersiva que utiliza elementos de RPG para crear una experiencia de aprendizaje única. La plataforma estará basada en mundos temáticos con estética pixel art e interfaz isométrica, donde el contenido educativo se presenta a través de interacciones con NPCs.

La arquitectura elegida combina un frontend moderno en React con un backend en Node.js/Express y una base de datos MySQL, todo integrado con un motor de juegos Phaser 3 para crear experiencias interactivas en tiempo real. Esta combinación de tecnologías permite:

1. Desarrollo ágil y estructura escalable
2. Separación clara de lógica de negocio y presentación
3. Facilidad de integración entre componentes del juego y UI tradicional
4. Persistencia de datos robusta y segura
5. Despliegue sencillo usando contenedores Docker

## Fase 1: Configuración del Proyecto y Prototipo Base (4 semanas)

### 1.1 Configuración de Entorno de Desarrollo (1 semana)

#### Objetivos Técnicos
- Establecer un entorno de desarrollo estandarizado y reproducible
- Implementar Docker para manejar todas las dependencias y servicios
- Configurar sistema de control de versiones con flujo de trabajo claramente definido
- Establecer estructura base del proyecto con configuración inicial

#### Estructura del Proyecto
```
educational-rpg/
├── backend/             # API y lógica de negocio
│   ├── src/             # Código fuente
│   │   ├── config/      # Configuraciones (DB, auth, etc.)
│   │   ├── controllers/ # Controladores para manejar requests
│   │   ├── middleware/  # Middleware (auth, validación, etc.)
│   │   ├── models/      # Modelos de datos MySQL
│   │   ├── routes/      # Rutas de la API
│   │   ├── services/    # Servicios de negocio
│   │   └── utils/       # Utilidades compartidas
│   ├── tests/           # Tests unitarios e integración
│   ├── Dockerfile       # Configuración de container
│   └── package.json     # Dependencias de Node.js
├── frontend/            # Aplicación React
│   ├── public/          # Archivos estáticos
│   ├── src/             # Código fuente
│   │   ├── assets/      # Recursos gráficos y audio
│   │   ├── components/  # Componentes React reutilizables
│   │   ├── game/        # Lógica y escenas del juego
│   │   ├── hooks/       # Custom hooks de React
│   │   ├── pages/       # Páginas/vistas completas
│   │   ├── services/    # Servicios para API y lógica
│   │   └── store/       # Estado global (Redux/Zustand)
│   ├── Dockerfile       # Configuración de container
│   └── package.json     # Dependencias
├── docker-compose.yml   # Configuración de servicios
└── README.md            # Documentación general
```

#### Configuración de Docker

**docker-compose.yml**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: educational-rpg-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "${MYSQL_PORT}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d
    networks:
      - app-network
    command: --default-authentication-plugin=mysql_native_password
      
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: educational-rpg-backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DB_HOST: mysql
      DB_USER: ${MYSQL_USER}
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_NAME: ${MYSQL_DATABASE}
      DB_PORT: 3306
      JWT_SECRET: ${JWT_SECRET}
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "${API_PORT}:3000"
    depends_on:
      - mysql
    networks:
      - app-network
      
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: educational-rpg-frontend
    restart: unless-stopped
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "${FRONTEND_PORT}:5173"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql_data:
```

**Dockerfile Backend (Dockerfile.dev)**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

**Dockerfile Frontend (Dockerfile.dev)**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

#### Recursos Específicos para Configuración Inicial

**Docker y MySQL:**
- Docker Documentación Oficial: https://docs.docker.com/get-started/
- MySQL con Docker: https://hub.docker.com/_/mysql
- Administración de MySQL con Adminer: https://www.adminer.org/
- Guía definitiva de MySQL 8 con Docker: https://severalnines.com/blog/mysql-docker-containers-understanding-basics/

**Backend (Node.js/Express):**
- Estructura de proyectos en Express: https://expressjs.com/en/starter/generator.html
- Mejores prácticas para API REST: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
- Sequelize ORM para MySQL: https://sequelize.org/master/manual/getting-started.html
- Autenticación JWT con Express: https://jwt.io/introduction/

**Frontend (React/Vite):**
- Vite para React: https://vitejs.dev/guide/#scaffolding-your-first-vite-project
- Estructura recomendada para apps React: https://react.dev/learn/thinking-in-react
- Gestión de estado global con Redux Toolkit: https://redux-toolkit.js.org/introduction/getting-started

### 1.2 Implementación de Modelos de Datos y Esquema MySQL (1 semana)

#### Objetivos Técnicos
- Diseñar un esquema de base de datos relacional optimizado
- Implementar modelos con Sequelize ORM
- Configurar migraciones y semillas para gestionar evolución del esquema
- Establecer relaciones y consultas optimizadas

#### Esquema de Base de Datos

**Scripts SQL de Inicialización**

```sql
-- MySQL init script (init/01-schema.sql)
CREATE DATABASE IF NOT EXISTS educational_rpg;
USE educational_rpg;

-- Tabla de usuarios
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de mundos
CREATE TABLE worlds (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  theme VARCHAR(50),
  tilemap_key VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de NPCs
CREATE TABLE npcs (
  id VARCHAR(36) PRIMARY KEY,
  world_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sprite_key VARCHAR(100),
  dialogue_tree JSON,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE
);

-- Tabla de lecciones
CREATE TABLE lessons (
  id VARCHAR(36) PRIMARY KEY,
  npc_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSON NOT NULL,
  quiz JSON,
  xp_reward INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Tabla de progreso del usuario
CREATE TABLE user_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  lesson_id VARCHAR(36) NOT NULL,
  status ENUM('started', 'completed') DEFAULT 'started',
  score INT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY user_lesson (user_id, lesson_id)
);

-- Tabla de logros
CREATE TABLE achievements (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_key VARCHAR(100),
  criteria JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de logros del usuario
CREATE TABLE user_achievements (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  achievement_id VARCHAR(36) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  UNIQUE KEY user_achievement (user_id, achievement_id)
);

-- Índices para optimizar consultas
CREATE INDEX idx_npcs_world ON npcs(world_id);
CREATE INDEX idx_lessons_npc ON lessons(npc_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
```

#### Implementación con Sequelize ORM

**Configuración de Sequelize**

```javascript
// Componente de Quiz
// frontend/src/components/lesson/Quiz.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const Quiz = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState(new Array(questions.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    onSubmit(answers);
  };
  
  const question = questions[currentQuestion];
  
  return (
    <div className="py-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Evaluación</h2>
        <div className="text-gray-400">
          Pregunta {currentQuestion + 1} de {questions.length}
        </div>
      </div>
      
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-6 mb-6"
      >
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        
        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerChange(index)}
                  className="mr-3"
                />
                <label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'true-false' && (
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="true"
                name={`question-${currentQuestion}`}
                value="true"
                checked={answers[currentQuestion] === true}
                onChange={() => handleAnswerChange(true)}
                className="mr-3"
              />
              <label htmlFor="true" className="cursor-pointer">
                Verdadero
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="false"
                name={`question-${currentQuestion}`}
                value="false"
                checked={answers[currentQuestion] === false}
                onChange={() => handleAnswerChange(false)}
                className="mr-3"
              />
              <label htmlFor="false" className="cursor-pointer">
                Falso
              </label>
            </div>
          </div>
        )}
        
        {question.type === 'short-answer' && (
          <div>
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              rows={4}
              placeholder="Escribe tu respuesta..."
            />
          </div>
        )}
      </motion.div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Anterior
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
          >
            Finalizar
          </button>
        )}
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion
                  ? 'bg-blue-500'
                  : answers[index]
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              }`}
              aria-label={`Ir a pregunta ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;</h1>
            {lesson.npc && (
              <p className="text-blue-400 mt-2">Presentado por: {lesson.npc.name}</p>
            )}
          </div>
          
          <div className="p-6">
            {!showQuiz ? (
              <>
                <LessonContent content={lesson.content} />
                
                {lesson.quiz && !quizResult && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleStartQuiz}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition-colors"
                    >
                      Comenzar Evaluación
                    </button>
                  </div>
                )}
                
                {quizResult && (
                  <div className="mt-8 p-4 rounded-md bg-gray-800">
                    <h3 className="text-xl font-semibold mb-2">Resultado:</h3>
                    <p className="mb-2">
                      <span className="font-semibold">Puntuación:</span> {quizResult.score}%
                    </p>
                    <p className="mb-4">
                      <span className="font-semibold">Estado:</span>{' '}
                      <span className={quizResult.passed ? 'text-green-500' : 'text-red-500'}>
                        {quizResult.passed ? 'Aprobado' : 'No aprobado'}
                      </span>
                    </p>
                    
                    {quizResult.passed && quizResult.xpEarned > 0 && (
                      <p className="text-yellow-400">
                        ¡Has ganado {quizResult.xpEarned} puntos de experiencia!
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Quiz
                questions={lesson.quiz.questions}
                onSubmit={handleSubmitQuiz}
              />
            )}
          </div>
          
          <div className="p-6 border-t border-gray-700 flex justify-between">
            <button
              onClick={() => navigate('/game')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
            >
              Volver al Juego
            </button>
            
            {quizResult?.passed && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Ver Progreso
              </button>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Modal de Resultados */}
      {showResult && (
        <ResultModal
          result={quizResult}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
};

export default LessonView;
src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    timezone: '+00:00',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

**Modelos Sequelize**

```javascript
// backend/src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  avatar_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

// Método para verificar contraseña
User.prototype.verifyPassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;
```

#### Recursos Específicos para Modelado de Datos

**MySQL y Diseño de Base de Datos:**
- MySQL Documentation: https://dev.mysql.com/doc/refman/8.0/en/
- Diseño de Esquemas Relacionales: https://www.lucidchart.com/pages/database-diagram/database-design
- Índices y Optimización en MySQL: https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html
- Guía completa sobre tipos de datos: https://dev.mysql.com/doc/refman/8.0/en/data-types.html

**Sequelize ORM:**
- Sequelize Models: https://sequelize.org/master/manual/model-basics.html
- Relaciones en Sequelize: https://sequelize.org/master/manual/assocs.html
- Migraciones con Sequelize: https://sequelize.org/master/manual/migrations.html
- Queries complejas y optimización: https://sequelize.org/master/manual/raw-queries.html

### 1.3 Implementación del Prototipo de Juego (2 semanas)

#### Objetivos Técnicos
- Integrar Phaser 3 con React mediante componente de contenedor
- Implementar carga de recursos y sistema de escenas base
- Crear primera escena con movimiento de personaje e interacciones básicas
- Establecer comunicación entre juego y UI de React

#### Integración de Phaser con React

```javascript
// frontend/src/components/game/GameContainer.jsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from '../../game/scenes/BootScene';
import { PreloadScene } from '../../game/scenes/PreloadScene';
import { WorldScene } from '../../game/scenes/WorldScene';
import { UiScene } from '../../game/scenes/UiScene';
import { useGameState } from '../../hooks/useGameState';

const GameContainer = () => {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const { setGameInstance } = useGameState();

  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      const config = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 800,
        height: 600,
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: process.env.NODE_ENV === 'development'
          }
        },
        scene: [BootScene, PreloadScene, WorldScene, UiScene]
      };

      gameInstanceRef.current = new Phaser.Game(config);
      
      // Exponer eventos del juego a React
      const eventEmitter = new Phaser.Events.EventEmitter();
      window.gameEvents = eventEmitter;
      
      // Pasar instancia del juego al estado global
      setGameInstance(gameInstanceRef.current);

      return () => {
        if (gameInstanceRef.current) {
          gameInstanceRef.current.destroy(true);
          gameInstanceRef.current = null;
        }
      };
    }
  }, [setGameInstance]);

  return (
    <div 
      ref={gameContainerRef} 
      className="game-container w-full h-full"
      style={{ height: 'calc(100vh - 64px)' }}
    />
  );
};

export default GameContainer;
```

#### Escenas Principales del Juego

```javascript
// frontend/src/game/scenes/WorldScene.js
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';

export class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data) {
    this.worldId = data.worldId || 'greece';
  }

  create() {
    // Crear mapa desde Tiled
    this.map = this.make.tilemap({ key: `${this.worldId}-map` });
    
    // Añadir tilesets
    const tileset = this.map.addTilesetImage('tileset', `${this.worldId}-tiles`);
    
    // Crear capas
    this.groundLayer = this.map.createLayer('Ground', tileset);
    this.objectsLayer = this.map.createLayer('Objects', tileset);
    this.aboveLayer = this.map.createLayer('Above', tileset);
    
    // Configurar colisiones
    this.objectsLayer.setCollisionByProperty({ collides: true });
    
    // Establecer límites del mundo
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    
    // Crear jugador en posición inicial
    const spawnPoint = this.map.findObject('Objects', obj => obj.name === 'SpawnPoint');
    this.player = new Player(
      this, 
      spawnPoint ? spawnPoint.x : 100, 
      spawnPoint ? spawnPoint.y : 100
    );
    
    // Configurar cámara
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    this.cameras.main.setZoom(1.5);
    
    // Establecer profundidad de capas
    this.aboveLayer.setDepth(10);
    this.player.setDepth(5);
    
    // Cargar NPCs desde API
    this.loadNPCs();
    
    // Configurar colisiones entre jugador y objetos
    this.physics.add.collider(this.player, this.objectsLayer);
    
    // Crear controles
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Manejar interacciones
    this.input.keyboard.on('keydown-SPACE', () => {
      this.checkNPCInteraction();
    });
  }
  
  update(time, delta) {
    if (this.player) {
      this.player.update(this.cursors);
    }
  }
  
  async loadNPCs() {
    try {
      // En un escenario real, esto vendría de la API
      const npcsData = [
        { 
          id: 'socrates', 
          name: 'Sócrates', 
          x: 200, 
          y: 150, 
          sprite: 'npc-philosopher'
        },
        { 
          id: 'platon', 
          name: 'Platón', 
          x: 400, 
          y: 250, 
          sprite: 'npc-philosopher'
        }
      ];
      
      this.npcs = npcsData.map(npcData => {
        const npc = new NPC(this, npcData.x, npcData.y, npcData.sprite, npcData);
        npc.setDepth(5);
        return npc;
      });
      
      // Añadir colisiones entre jugador y NPCs
      this.physics.add.collider(this.player, this.npcs);
    } catch (error) {
      console.error('Error loading NPCs:', error);
    }
  }
  
  checkNPCInteraction() {
    const interactionDistance = 50;
    
    for (const npc of this.npcs) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, 
        this.player.y, 
        npc.x, 
        npc.y
      );
      
      if (distance < interactionDistance) {
        // Trigger NPC dialogue
        window.gameEvents.emit('npc-interaction', npc.getData());
        break;
      }
    }
  }
}
```

#### Entidad del Jugador

```javascript
// frontend/src/game/entities/Player.js
import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    
    // Añadir a la escena
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Configuración física
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setSize(16, 16);
    this.setOffset(8, 16);
    
    // Variables de movimiento
    this.moveSpeed = 160;
    this.isMoving = false;
    this.direction = 'down';
    
    // Animaciones
    this.createAnimations();
  }
  
  createAnimations() {
    // Animaciones de caminar
    const directions = ['down', 'left', 'right', 'up'];
    const framesPerDirection = 4;
    
    directions.forEach((direction, index) => {
      this.scene.anims.create({
        key: `walk-${direction}`,
        frames: this.scene.anims.generateFrameNumbers('player', { 
          start: index * framesPerDirection, 
          end: (index * framesPerDirection) + (framesPerDirection - 1) 
        }),
        frameRate: 10,
        repeat: -1
      });
      
      // Animación idle (estático)
      this.scene.anims.create({
        key: `idle-${direction}`,
        frames: [{ key: 'player', frame: index * framesPerDirection }],
        frameRate: 10
      });
    });
  }
  
  update(cursors) {
    // Reiniciar velocidad
    this.setVelocity(0);
    
    // Manejar movimientos
    let moving = false;
    
    if (cursors.left.isDown) {
      this.setVelocityX(-this.moveSpeed);
      this.direction = 'left';
      moving = true;
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.moveSpeed);
      this.direction = 'right';
      moving = true;
    }
    
    if (cursors.up.isDown) {
      this.setVelocityY(-this.moveSpeed);
      this.direction = 'up';
      moving = true;
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.moveSpeed);
      this.direction = 'down';
      moving = true;
    }
    
    // Normalizar diagonal
    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.normalize().scale(this.moveSpeed);
    }
    
    // Actualizar animaciones
    if (moving) {
      this.anims.play(`walk-${this.direction}`, true);
    } else {
      this.anims.play(`idle-${this.direction}`, true);
    }
    
    this.isMoving = moving;
  }
}
```

#### Recursos Específicos para Phaser y React

**Phaser 3:**
- Documentación oficial: https://photonstorm.github.io/phaser3-docs/
- Phaser 3 Examples: https://phaser.io/examples
- Guía de escenas en Phaser: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
- Tutorial de Tilemaps: https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6

**Integración con React:**
- Phaser 3 en proyectos React: https://blog.ourcade.co/posts/2020/phaser-3-react-typescript-tutorial/
- Comunicación entre Phaser y React: https://blog.logrocket.com/build-a-game-react-and-phaser-3/
- Gestión de recursos en aplicaciones de juego: https://www.joshmorony.com/how-to-preload-audio-for-phaser-3-in-react/

**Desarrollo de Juegos 2D:**
- Spritesheet Animation: https://labs.phaser.io/edit.html?src=src/animation/create%20animation.js
- Tiled Map Editor: https://www.mapeditor.org/
- Pixel Art Resources: https://opengameart.org/art-search-advanced?keys=&field_art_tags_tid_op=or&field_art_tags_tid=pixelart

## Fase 2: Sistema Core de Juego y API (4 semanas)

### 2.1 Sistema de Autenticación y Seguridad (1 semana)

#### Objetivos Técnicos
- Implementar sistema de registro y login seguro
- Configurar autenticación basada en JWT
- Implementar middleware de protección de rutas
- Establecer políticas de seguridad para API y frontend

#### API de Autenticación

```javascript
// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ValidationError } = require('sequelize');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Email o nombre de usuario ya registrado' 
      });
    }
    
    const user = await User.create({
      username,
      email,
      password_hash: password
    });
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_id: user.avatar_id
      }
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const isPasswordValid = await user.verifyPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_id: user.avatar_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Verificar token
exports.verify = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      avatar_id: req.user.avatar_id
    }
  });
};
```

#### Middleware de Autenticación

```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    // Verificar header de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Se requiere token de autenticación' });
    }
    
    // Extraer token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en DB
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    // Adjuntar usuario a request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Middleware para verificar rol de administrador
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requiere rol de administrador' 
    });
  }
  next();
};

// Frontend: Hooks para Autenticación
// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          setLoading(true);
          const userData = await AuthService.verifyToken();
          setUser(userData);
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { token, user } = await AuthService.login(email, password);
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      const { token, user } = await AuthService.register(userData);
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };
  
  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};

// AuthContext para gestión global del estado de autenticación
// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await AuthService.verifyToken();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const authContextValue = {
    user,
    loading,
    error,
    setUser,
    setError,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

#### Recursos Específicos para Autenticación y Seguridad

**JWT y Autenticación:**
- JWT Documentation: https://jwt.io/introduction/
- Autenticación con JWT en Express: https://expressjs.com/en/resources/middleware/jwt.html
- Mejores prácticas para almacenamiento de tokens: https://auth0.com/docs/secure/tokens/token-storage
- Cookies seguras vs localStorage: https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id

**Seguridad en API:**
- OWASP API Security Top 10: https://owasp.org/www-project-api-security/
- Protección contra XSS y CSRF: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Helmet.js para Express: https://helmetjs.github.io/
- Rate Limiting en Express: https://www.npmjs.com/package/express-rate-limit

**Context API de React:**
- React Context Documentation: https://reactjs.org/docs/context.html
- React Authentication Patterns: https://kentcdodds.com/blog/authentication-in-react-applications

### 2.2 Sistema de Interacción con NPCs y Diálogos (1 semana)

#### Objetivos Técnicos
- Diseñar estructura de datos para diálogos ramificados
- Implementar sistema de condiciones y efectos en diálogos
- Crear componentes de UI para mostrar conversaciones
- Integrar sistema de progreso con interacciones

#### Estructura de Datos para Diálogos

```javascript
// Ejemplo de estructura JSON para diálogo de NPC
{
  "npcId": "socrates",
  "name": "Sócrates",
  "dialogues": {
    "default": {
      "nodes": [
        {
          "id": "start",
          "text": "Saludos, viajero. Soy Sócrates. ¿Qué te trae por la Academia?",
          "choices": [
            {
              "text": "Estoy aquí para aprender sobre filosofía.",
              "nextId": "about_philosophy"
            },
            {
              "text": "¿Quién eres exactamente?",
              "nextId": "about_socrates"
            },
            {
              "text": "Sólo estoy explorando.",
              "nextId": "exploring"
            }
          ]
        },
        {
          "id": "about_philosophy",
          "text": "¡Excelente! La filosofía es el amor por la sabiduría. La verdadera sabiduría comienza reconociendo que no sabemos nada. ¿Quieres comenzar tu primera lección?",
          "choices": [
            {
              "text": "Sí, estoy listo para aprender.",
              "nextId": "start_lesson",
              "trigger": {
                "type": "startLesson",
                "lessonId": "socrates_intro"
              }
            },
            {
              "text": "Volveré más tarde.",
              "nextId": "goodbye"
            }
          ]
        },
        {
          "id": "about_socrates",
          "text": "Soy un filósofo ateniense. Mi método consiste en hacer preguntas para explorar conceptos complejos y encontrar contradicciones en nuestras creencias. Algunos lo llaman la mayéutica o arte de dar a luz ideas.",
          "choices": [
            {
              "text": "Cuéntame más sobre tu método.",
              "nextId": "socratic_method"
            },
            {
              "text": "Interesante. ¿Podemos hablar de otra cosa?",
              "nextId": "start"
            }
          ]
        },
        {
          "id": "socratic_method",
          "text": "Mi método busca llegar a la verdad a través del diálogo y el cuestionamiento. Creo que las personas ya tienen conocimiento dentro de sí, y las preguntas correctas pueden ayudarles a descubrirlo. ¿Quieres experimentar este método?",
          "choices": [
            {
              "text": "Sí, hagamos un ejercicio.",
              "nextId": "start_lesson",
              "trigger": {
                "type": "startLesson",
                "lessonId": "socratic_method_intro"
              }
            },
            {
              "text": "Quizás en otro momento.",
              "nextId": "goodbye"
            }
          ]
        },
        {
          "id": "exploring",
          "text": "La curiosidad es el principio de toda sabiduría. Explora libremente, y cuando tengas preguntas, estaré aquí para conversar.",
          "nextId": "goodbye"
        },
        {
          "id": "goodbye",
          "text": "Que tengas un buen día. Recuerda: 'Una vida sin examen no merece ser vivida'.",
          "nextId": null
        }
      ]
    },
    "completed_intro": {
      "condition": {
        "type": "lessonCompleted",
        "lessonId": "socrates_intro"
      },
      "nodes": [
        {
          "id": "start",
          "text": "¡Bienvenido de nuevo! Veo que has comprendido los fundamentos de la filosofía. ¿Quieres continuar con tu aprendizaje?",
          "choices": [
            {
              "text": "Sí, estoy listo para la siguiente lección.",
              "nextId": "next_lesson",
              "trigger": {
                "type": "startLesson",
                "lessonId": "socrates_ethics"
              }
            },
            {
              "text": "Prefiero repasar lo que ya aprendí.",
              "nextId": "review_lesson",
              "trigger": {
                "type": "startLesson",
                "lessonId": "socrates_intro"
              }
            },
            {
              "text": "Sólo pasaba a saludar.",
              "nextId": "casual_chat"
            }
          ]
        },
        // más nodos...
      ]
    }
  }
}
```

#### Sistema de Diálogos en el Backend

```javascript
// backend/src/controllers/dialogueController.js
const { NPC, UserProgress } = require('../models');

exports.getNPCDialogue = async (req, res) => {
  try {
    const { npcId } = req.params;
    const userId = req.user.id;
    
    // Obtener datos del NPC
    const npc = await NPC.findOne({ 
      where: { id: npcId },
      attributes: ['id', 'name', 'dialogue_tree']
    });
    
    if (!npc) {
      return res.status(404).json({ message: 'NPC no encontrado' });
    }
    
    // Obtener progreso del usuario para determinar diálogo apropiado
    const userProgress = await UserProgress.findAll({
      where: { user_id: userId },
      include: [{
        model: Lesson,
        where: { npc_id: npcId },
        required: false
      }]
    });
    
    // Seleccionar el diálogo correcto basado en el progreso
    const dialogueKey = selectDialogueBasedOnProgress(npc.dialogue_tree, userProgress);
    
    return res.status(200).json({
      npc: {
        id: npc.id,
        name: npc.name
      },
      dialogue: npc.dialogue_tree[dialogueKey]
    });
  } catch (error) {
    console.error('Error fetching NPC dialogue:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para seleccionar el diálogo apropiado
function selectDialogueBasedOnProgress(dialogueTree, userProgress) {
  // Si no hay progreso, usar diálogo por defecto
  if (!userProgress || userProgress.length === 0) {
    return 'default';
  }
  
  // Verificar cada diálogo con condiciones
  for (const [key, dialogue] of Object.entries(dialogueTree)) {
    if (key === 'default') continue;
    
    if (dialogue.condition && evaluateCondition(dialogue.condition, userProgress)) {
      return key;
    }
  }
  
  // Si ninguna condición se cumple, usar diálogo por defecto
  return 'default';
}

// Evaluar condiciones de diálogo
function evaluateCondition(condition, userProgress) {
  if (condition.type === 'lessonCompleted') {
    return userProgress.some(progress => 
      progress.lesson.id === condition.lessonId && 
      progress.status === 'completed'
    );
  }
  
  if (condition.type === 'multipleCompleted') {
    return condition.lessonIds.every(lessonId => 
      userProgress.some(progress => 
        progress.lesson.id === lessonId && 
        progress.status === 'completed'
      )
    );
  }
  
  // Más tipos de condiciones según sea necesario
  
  return false;
}
```

#### Componente de Diálogo en React

```jsx
// frontend/src/components/game/DialogueBox.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogue } from '../../hooks/useDialogue';

const DialogueBox = () => {
  const { 
    currentDialogue, 
    npc, 
    isActive, 
    selectChoice, 
    closeDialogue 
  } = useDialogue();
  
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Efecto para animación de escritura
  useEffect(() => {
    if (!currentDialogue || !isActive) return;
    
    setIsTyping(true);
    setTypedText('');
    
    const text = currentDialogue.text;
    let index = 0;
    
    const interval = setInterval(() => {
      setTypedText(prev => prev + text[index]);
      index++;
      
      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20); // velocidad del texto
    
    return () => clearInterval(interval);
  }, [currentDialogue, isActive]);
  
  if (!isActive || !currentDialogue) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-5/6 max-w-3xl z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-gray-900 bg-opacity-95 rounded-lg shadow-lg p-6 border border-blue-500">
          {npc && (
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <span className="text-xl font-semibold">{npc.name[0]}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-400">{npc.name}</h3>
            </div>
          )}
          
          <p className="text-white text-lg mb-6 min-h-[80px]">
            {typedText}
          </p>
          
          {!isTyping && currentDialogue.choices ? (
            <div className="space-y-2">
              {currentDialogue.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => selectChoice(index)}
                  className="w-full text-left p-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-right">
              {!isTyping && !currentDialogue.choices && (
                <button
                  onClick={closeDialogue}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  Cerrar
                </button>
              )}
              {isTyping && (
                <button
                  onClick={() => setIsTyping(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  Omitir
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DialogueBox;
```

#### Hook para Gestión de Diálogos

```javascript
// frontend/src/hooks/useDialogue.js
import { useState, useEffect, useContext, createContext } from 'react';
import { DialogueService } from '../services/dialogueService';
import { useAuth } from './useAuth';

const DialogueContext = createContext(null);

export const DialogueProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentNPC, setCurrentNPC] = useState(null);
  const [dialogue, setDialogue] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const { user } = useAuth();
  
  // Reset dialogue state
  const resetDialogue = () => {
    setIsActive(false);
    setCurrentNPC(null);
    setDialogue(null);
    setCurrentNodeId(null);
  };
  
  // Start dialogue with an NPC
  const startDialogue = async (npcId) => {
    if (!user) return;
    
    try {
      const { npc, dialogue } = await DialogueService.getNPCDialogue(npcId);
      setCurrentNPC(npc);
      setDialogue(dialogue);
      setCurrentNodeId('start');
      setIsActive(true);
    } catch (error) {
      console.error('Error starting dialogue:', error);
    }
  };
  
  // Select a dialogue choice
  const selectChoice = (choiceIndex) => {
    if (!dialogue || !currentNodeId) return;
    
    const currentNode = dialogue.nodes.find(node => node.id === currentNodeId);
    
    if (!currentNode || !currentNode.choices || choiceIndex >= currentNode.choices.length) {
      return;
    }
    
    const choice = currentNode.choices[choiceIndex];
    
    // Process any triggers
    if (choice.trigger) {
      handleTrigger(choice.trigger);
    }
    
    // Move to next dialogue node
    setCurrentNodeId(choice.nextId);
  };
  
  // Close the dialogue
  const closeDialogue = () => {
    resetDialogue();
    // Notify game to resume
    window.gameEvents?.emit('dialogue-closed');
  };
  
  // Handle dialogue triggers
  const handleTrigger = async (trigger) => {
    if (!trigger || !user) return;
    
    try {
      switch (trigger.type) {
        case 'startLesson':
          // Emit event to start lesson
          window.gameEvents?.emit('start-lesson', trigger.lessonId);
          closeDialogue();
          break;
        case 'giveItem':
          // Process item giving
          await DialogueService.processItemTrigger(user.id, trigger.itemId);
          break;
        case 'updateQuest':
          // Update quest progress
          await DialogueService.processQuestTrigger(user.id, trigger.questId, trigger.action);
          break;
        default:
          console.warn('Unknown trigger type:', trigger.type);
      }
    } catch (error) {
      console.error('Error processing trigger:', error);
    }
  };
  
  // Get current dialogue node
  const getCurrentNode = () => {
    if (!dialogue || !currentNodeId) return null;
    return dialogue.nodes.find(node => node.id === currentNodeId);
  };
  
  // Context value
  const value = {
    isActive,
    npc: currentNPC,
    currentDialogue: getCurrentNode(),
    startDialogue,
    selectChoice,
    closeDialogue
  };
  
  return (
    <DialogueContext.Provider value={value}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogue = () => {
  const context = useContext(DialogueContext);
  if (!context) {
    throw new Error('useDialogue must be used within a DialogueProvider');
  }
  return context;
};

// Listener para eventos del juego
export const useDialogueGameEvents = () => {
  const { startDialogue } = useDialogue();
  
  useEffect(() => {
    // Suscribirse a eventos del juego
    const handleNPCInteraction = (npcData) => {
      startDialogue(npcData.id);
    };
    
    window.gameEvents?.on('npc-interaction', handleNPCInteraction);
    
    return () => {
      window.gameEvents?.off('npc-interaction', handleNPCInteraction);
    };
  }, [startDialogue]);
  
  return null;
};
```

#### Recursos Específicos para Sistemas de Diálogo

**Sistemas de Diálogo en Juegos:**
- Estructuras de datos para diálogos: https://www.gamedeveloper.com/design/defining-dialogue-systems
- Yarn Spinner Docs: https://yarnspinner.dev/docs/
- Ink Scripting Language: https://www.inklestudios.com/ink/
- Tutorial de Dialogue Trees: https://medium.com/kitfox-games/how-to-design-better-dialogue-trees-fe4f4686a410

**UI para Diálogos:**
- Framer Motion para React: https://www.framer.com/motion/
- Designing Game Conversations: https://www.psychologyofgames.com/2019/03/the-psychology-of-video-game-dialogue/
- Typing Animation Effects: https://css-tricks.com/snippets/css/typewriter-effect/

**Integración con Phaser:**
- Gestión de eventos entre Phaser y React: https://blog.ourcade.co/posts/2020/phaser-3-react-typescript-tutorial/
- Pausar juego durante diálogos: https://phaser.io/examples/v3/view/scenes/scene-from-another-scene

### 2.3 Sistema de Lecciones y Evaluación (1 semana)

#### Objetivos Técnicos
- Diseñar estructura de datos para lecciones interactivas
- Implementar sistema de quizzes y evaluación
- Crear componentes de UI para presentar contenido educativo
- Integrar sistema de progreso y recompensas

#### Modelo de Datos para Lecciones

```javascript
// backend/


