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
    FOREIGN KEY (parking_id) REFERENCES Parking(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA: Plaza
-- ==========================
CREATE TABLE IF NOT EXISTS Plaza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planta_id INT,
    numero INT NOT NULL,
    tipo ENUM('Coche', 'Moto', 'Especial', 'Eléctrico', 'Discapacitados', 'VIP') NOT NULL,
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
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculo(id) ON DELETE SET NULL,
    FOREIGN KEY (plaza_id) REFERENCES Plaza(id) ON DELETE SET NULL,
    CONSTRAINT unique_reserva UNIQUE (plaza_id, start_time, end_time)
);

-- ==========================
-- TABLA: HistorialReserva
-- ==========================
CREATE TABLE IF NOT EXISTS HistorialReserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plaza_id INT,
    usuario_id INT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plaza_id) REFERENCES Plaza(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE SET NULL
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
    FOREIGN KEY (parking_id) REFERENCES Parking(id) ON DELETE CASCADE
);

-- ==========================
-- Índices para mejorar rendimiento
-- ==========================
/*
CREATE INDEX idx_reserva_user_id ON Reserva(user_id);
CREATE INDEX idx_reserva_vehiculo_id ON Reserva(vehiculo_id);
CREATE INDEX idx_reserva_plaza_id ON Reserva(plaza_id);
CREATE INDEX idx_reserva_created_at ON Reserva(created_at);
CREATE INDEX idx_reserva_estado ON Reserva(status);
CREATE INDEX idx_parking_ubicacion ON Parking(ubicacion);
*/

