import { pool } from '../../utils/dbConnection.js';
import { update } from '../../utils/update.js';

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerGenre = genre.toLowerCase();

      const query = `
      SELECT m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate
      FROM movies AS m
      JOIN movie_genres AS mg
          ON m.id = mg.movie_id
      JOIN genres AS g
          ON mg.genre_id = g.id
      WHERE LOWER(g.name) = $1;
      `;

      const { rows: filteredMovies } = await pool.query(query, [lowerGenre]);
      return filteredMovies;
    }

    const { rows: movies } = await pool.query('SELECT * FROM movies;');
    return movies;
  }

  static async getById({ id }) {
    const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1;', [
      id
    ]);

    if (rows.length === 0) {
      return null;
    }

    const movieFound = rows[0];
    return movieFound;
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input;

    const { rows: uuidResult } = await pool.query(
      'SELECT uuid_generate_v4() AS uuid;'
    );
    const [{ uuid }] = uuidResult;

    try {
      await pool.query(
        'INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES ($1, $2, $3, $4, $5, $6, $7);',
        [uuid, title, year, director, duration, poster, rate]
      );
    } catch (error) {
      console.error(error);
    }

    genreInput.forEach(async (genre) => {
      const { rows } = await pool.query(
        'SELECT id, name FROM genres WHERE name = $1;',
        [genre]
      );
      const genreFound = rows[0];

      await pool.query(
        'INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2);',
        [uuid, genreFound.id]
      );
    });

    const { rows: movieResult } = await pool.query(
      'SELECT * FROM movies WHERE id = $1;',
      [uuid]
    );

    const movieCreated = movieResult[0];
    return movieCreated;
  }

  static async update({ id, input }) {
    try {
      await pool.query('SELECT id FROM movies WHERE id = $1;', [id]);
    } catch (error) {
      return null;
    }

    if (Object.hasOwn(input, 'genre')) {
      input.genre.forEach(async (genre) => {
        const { rows: genreResult } = await pool.query(
          'SELECT id, name FROM genres WHERE name = $1;',
          [genre]
        );
        const genreFound = genreResult[0];

        const { rows: movieGenreResult } = await pool.query(
          'SELECT * FROM movie_genres WHERE movie_id = $1 AND genre_id = $2;',
          [id, genreFound.id]
        );

        if (movieGenreResult.length === 0) {
          await pool.query(
            'INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2);',
            [id, genreFound.id]
          );
        }
      });

      delete input.genre;
    }

    try {
      const acceptedFields = [
        'title',
        'year',
        'director',
        'duration',
        'poster',
        'rate'
      ];

      const { setString, valuesToUpdate, lastIndex } = update({
        acceptedFields,
        input
      });

      await pool.query(
        `UPDATE movies SET ${setString} WHERE id = $${lastIndex};`,
        [...valuesToUpdate, id]
      );
    } catch (error) {
      console.error(error);
    }

    const { rows: movieResult } = await pool.query(
      'SELECT * FROM movies WHERE id = $1;',
      [id]
    );

    const movieUpdated = movieResult[0];
    return movieUpdated;
  }

  static async delete({ id }) {
    try {
      await pool.query('DELETE FROM movies WHERE id = $1;', [id]);
    } catch (error) {
      return null;
    }
  }
}
