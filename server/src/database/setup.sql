-- Crear base de datos
CREATE DATABASE IF NOT EXISTS parksystem;
USE parksystem;

-- ==========================
-- TABLA: Usuario
-- ==========================
CREATE TABLE IF NOT EXISTS Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    telefono VARCHAR(15),
    rol ENUM('admin', 'conductor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- TABLA: Vehículo
-- ==========================
CREATE TABLE IF NOT EXISTS Vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(255),
    tipo ENUM('Coche', 'Moto', 'Especial') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA: Parking
-- ==========================
CREATE TABLE IF NOT EXISTS Parking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10,7) NOT NULL,
    longitud DECIMAL(10,7) NOT NULL,
    capacidad INT NOT NULL,
    estado ENUM('Operativo', 'Cerrado', 'Mantenimiento') DEFAULT 'Operativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- TABLA: Planta
-- ==========================
CREATE TABLE IF NOT EXISTS Planta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parking_id INT,
    numero INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parking_id) REFERENCES Parking(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA: Plaza
-- ==========================
CREATE TABLE IF NOT EXISTS Plaza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planta_id INT,
    numero INT NOT NULL,
    reservable BOOLEAN NOT NULL DEFAULT TRUE,
    tipo ENUM('Coche', 'Moto', 'Especial', 'Electrico', 'Discapacitados', 'VIP') NOT NULL,
    estado ENUM('Libre', 'Ocupado', 'Reservado') DEFAULT 'Libre',
    precio_por_hora DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (planta_id) REFERENCES Planta(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA: Reserva
-- ==========================
CREATE TABLE IF NOT EXISTS Reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vehiculo_id INT,
    plaza_id INT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    estado ENUM('activa', 'completada', 'cancelada') DEFAULT 'activa',
    precio_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculo(id) ON DELETE SET NULL,
    FOREIGN KEY (plaza_id) REFERENCES Plaza(id) ON DELETE SET NULL
);

-- ==========================
-- TABLA: ReservaRapida
-- ==========================
CREATE TABLE IF NOT EXISTS ReservaRapida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plaza_id INT,
    matricula VARCHAR(10) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    estado ENUM('activa', 'completada', 'cancelada') DEFAULT 'activa',
    precio_total DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plaza_id) REFERENCES Plaza(id) ON DELETE SET NULL
);

-- ==========================
-- TABLA: Eventos
-- ==========================
CREATE TABLE IF NOT EXISTS Eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plaza_id INT,
    tipo_evento ENUM('salida', 'entrada', 'anomalia') NOT NULL,
    matricula VARCHAR(10),
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plaza_id) REFERENCES Plaza(id) ON DELETE SET NULL
);


-- ==========================
-- TABLA: Valoración
-- ==========================
CREATE TABLE IF NOT EXISTS Valoracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    parking_id INT,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE SET NULL,
    FOREIGN KEY (parking_id) REFERENCES Parking(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA: Anuncio
-- ==========================
CREATE TABLE IF NOT EXISTS Anuncio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parking_id INT,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parking_id) REFERENCES Parking(id) ON DELETE CASCADE
);

-- ==========================
-- Índices para mejorar rendimiento
-- ==========================
CREATE INDEX IF NOT EXISTS idx_reserva_user_id ON Reserva(user_id);
CREATE INDEX IF NOT EXISTS idx_reserva_vehiculo_id ON Reserva(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_reserva_plaza_id ON Reserva(plaza_id);
CREATE INDEX IF NOT EXISTS idx_reserva_created_at ON Reserva(created_at);
CREATE INDEX IF NOT EXISTS idx_reserva_estado ON Reserva(estado);
CREATE INDEX IF NOT EXISTS idx_plaza_estado ON Plaza(estado);
CREATE INDEX IF NOT EXISTS idx_vehiculo_usuario ON Vehiculo(usuario_id);
CREATE INDEX IF NOT EXISTS idx_eventos_plaza ON Eventos(plaza_id);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON Eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_reservarapida_plaza ON ReservaRapida(plaza_id);
CREATE INDEX IF NOT EXISTS idx_reservarapida_estado ON ReservaRapida(estado);

