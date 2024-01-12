-- PostgreSQL 16.1

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
    id UUID DEFAULT uuid_generate_v4() NOT NULL,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    poster TEXT NOT NULL,
    rate DECIMAL(2, 1) DEFAULT 0,
    PRIMARY KEY (id)
);

INSERT INTO movies (title, year, director, duration, poster, rate) VALUES
    ('The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
    ('The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
    ('Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
    ('Pulp Fiction', 1994, 'Quentin Tarantino', 154, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9),
    ('Forrest Gump', 1994, 'Robert Zemeckis', 142, 'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 8.8),
    ('Gladiator', 2000, 'Ridley Scott', 155, 'https://img.fruugo.com/product/0/60/14417600_max.jpg', 8.5),
    ('The Matrix', 1999, 'Lana Wachowski', 136, 'https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg', 8.7),
    ('Interstellar', 2014, 'Christopher Nolan', 169, 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg', 8.6),
    ('The Lord of the RingsThe Return of the King', 2003, 'Peter Jackson', 201, 'https://i.ebayimg.com/images/g/0hoAAOSwe7peaMLW/s-l1600.jpg', 8.9),
    ('The Lion King', 1994, 'Roger Allers, Rob Minkoff', 88, 'https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg', 8.5),
    ('The Avengers', 2012, 'Joss Whedon', 143, 'https://img.fruugo.com/product/7/41/14532417_max.jpg', 8.0),
    ('Jurassic Park', 1993, 'Steven Spielberg', 127, 'https://vice-press.com/cdn/shop/products/Jurassic-Park-Editions-poster-florey.jpg?v=1654518755&width=1024', 8.1),
    ('Titanic', 1997, 'James Cameron', 195, 'https://i.pinimg.com/originals/42/42/65/4242658e6f1b0d6322a4a93e0383108b.png', 7.8),
    ('The Social Network', 2010, 'David Fincher', 120, 'https://i.pinimg.com/originals/7e/37/b9/7e37b994b613e94cba64f307b1983e39.jpg', 7.7),
    ('Avatar', 2009, 'James Cameron', 162, 'https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg', 7.8);


DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
    id SERIAL NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

INSERT INTO genres (name) VALUES
    ('Action'),
    ('Adventure'),
    ('Animation'),
    ('Biography'),
    ('Comedy'),
    ('Crime'),
    ('Drama'),
    ('Fantasy'),
    ('Horror'),
    ('Romance'),
    ('Sci-Fi'),
    ('Thriller');


DROP TABLE IF EXISTS movie_genres;

CREATE TABLE movie_genres (
    movie_id UUID NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ((SELECT id FROM movies WHERE title = 'The Shawshank Redemption'), 7),
    ((SELECT id FROM movies WHERE title = 'The Dark Knight'), 1),
    ((SELECT id FROM movies WHERE title = 'The Dark Knight'), 6),
    ((SELECT id FROM movies WHERE title = 'The Dark Knight'), 7),
    ((SELECT id FROM movies WHERE title = 'Inception'), 1),
    ((SELECT id FROM movies WHERE title = 'Inception'), 2),
    ((SELECT id FROM movies WHERE title = 'Inception'), 11),
    ((SELECT id FROM movies WHERE title = 'Pulp Fiction'), 6),
    ((SELECT id FROM movies WHERE title = 'Pulp Fiction'), 7),
    ((SELECT id FROM movies WHERE title = 'Forrest Gump'), 7),
    ((SELECT id FROM movies WHERE title = 'Forrest Gump'), 10),
    ((SELECT id FROM movies WHERE title = 'Gladiator'), 1),
    ((SELECT id FROM movies WHERE title = 'Gladiator'), 2),
    ((SELECT id FROM movies WHERE title = 'Gladiator'), 7),
    ((SELECT id FROM movies WHERE title = 'The Matrix'), 1),
    ((SELECT id FROM movies WHERE title = 'The Matrix'), 11),
    ((SELECT id FROM movies WHERE title = 'Interstellar'), 2),
    ((SELECT id FROM movies WHERE title = 'Interstellar'), 7),
    ((SELECT id FROM movies WHERE title = 'Interstellar'), 11),
    ((SELECT id FROM movies WHERE title = 'The Lord of the RingsThe Return of the King'), 1),
    ((SELECT id FROM movies WHERE title = 'The Lord of the RingsThe Return of the King'), 2),
    ((SELECT id FROM movies WHERE title = 'The Lord of the RingsThe Return of the King'), 7),
    ((SELECT id FROM movies WHERE title = 'The Lion King'), 2),
    ((SELECT id FROM movies WHERE title = 'The Lion King'), 3),
    ((SELECT id FROM movies WHERE title = 'The Lion King'), 7),
    ((SELECT id FROM movies WHERE title = 'The Avengers'), 1),
    ((SELECT id FROM movies WHERE title = 'The Avengers'), 2),
    ((SELECT id FROM movies WHERE title = 'The Avengers'), 11),
    ((SELECT id FROM movies WHERE title = 'Jurassic Park'), 2),
    ((SELECT id FROM movies WHERE title = 'Jurassic Park'), 11),
    ((SELECT id FROM movies WHERE title = 'Titanic'), 7),
    ((SELECT id FROM movies WHERE title = 'Titanic'), 10),
    ((SELECT id FROM movies WHERE title = 'The Social Network'), 4),
    ((SELECT id FROM movies WHERE title = 'The Social Network'), 7),
    ((SELECT id FROM movies WHERE title = 'Avatar'), 1),
    ((SELECT id FROM movies WHERE title = 'Avatar'), 2),
    ((SELECT id FROM movies WHERE title = 'Avatar'), 8);
