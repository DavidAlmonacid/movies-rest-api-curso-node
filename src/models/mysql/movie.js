import { connection } from '../../utils/dbConnection.js';

export class MovieModel {
  static async getAll({ genre }) {
    let query = '';

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      query = `
      SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.duration, m.poster, m.rate
      FROM movies AS m
      JOIN movie_genres AS mg
        ON m.id = mg.movie_id
      JOIN genres AS g
        ON mg.genre_id = g.id
      WHERE LOWER(g.name) = ?;
      `;

      const [filteredMovies] = await connection.query(query, [lowerCaseGenre]);

      return filteredMovies;
    }

    query =
      'SELECT BIN_TO_UUID(`id`) AS `id`, `title`, `year`, `director`, `duration`, `poster`, `rate` FROM movies;';

    const [movies] = await connection.query(query);

    return movies;
  }

  static async getById({ id }) {
    const query =
      'SELECT BIN_TO_UUID(`id`) AS `id`, `title`, `year`, `director`, `duration`, `poster`, `rate` FROM movies WHERE `id` = UUID_TO_BIN(?);';

    const [result] = await connection.query(query, [id]);

    if (result.length === 0) {
      return null;
    }

    const movieFound = result[0];
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

    const [uuidResult] = await connection.query('SELECT UUID() AS uuid;');
    const [{ uuid }] = uuidResult;

    genreInput.forEach(async (genre) => {
      const [resultGenre] = await connection.query(
        'SELECT `id`, `name` FROM genres WHERE `name` = ?;',
        [genre]
      );
      const genreFound = resultGenre[0];

      if (genreFound) {
        await connection.query(
          'INSERT INTO movie_genres (`movie_id`, `genre_id`) VALUES (UUID_TO_BIN(?), ?);',
          [uuid, genreFound.id]
        );
      }
    });

    try {
      await connection.query(
        'INSERT INTO movies (`id`, `title`, `year`, `director`, `duration`, `poster`, `rate`) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, title, year, director, duration, poster, rate]
      );
    } catch (error) {
      console.error(error);
    }

    const selectQuery =
      'SELECT BIN_TO_UUID(`id`) AS `id`, `title`, `year`, `director`, `duration`, `poster`, `rate` FROM movies WHERE `id` = UUID_TO_BIN(?);';

    const [resultMovie] = await connection.query(selectQuery, [uuid]);
    const movieCreated = resultMovie[0];
    return movieCreated;
  }

  static async update({ id, input }) {
    try {
      await connection.query(
        'SELECT `id` FROM movies WHERE `id` = UUID_TO_BIN(?);',
        [id]
      );
    } catch (error) {
      return null;
    }

    if (Object.hasOwn(input, 'genre')) {
      input.genre.forEach(async (genre) => {
        const [resultGenre] = await connection.query(
          'SELECT `id`, `name` FROM genres WHERE `name` = ?;',
          [genre]
        );
        const genreFound = resultGenre[0];

        if (genreFound) {
          const [resultMovieGenre] = await connection.query(
            'SELECT * FROM movie_genres WHERE `movie_id` = UUID_TO_BIN(?) AND `genre_id` = ?;',
            [id, genreFound.id]
          );

          if (resultMovieGenre.length === 0) {
            await connection.query(
              'INSERT INTO movie_genres (`movie_id`, `genre_id`) VALUES (UUID_TO_BIN(?), ?);',
              [id, genreFound.id]
            );
          }
        }
      });

      delete input.genre;
    }

    try {
      await connection.query(
        'UPDATE movies SET ? WHERE `id` = UUID_TO_BIN(?);',
        [input, id]
      );
    } catch (error) {
      console.error(error);
    }

    const selectQuery =
      'SELECT BIN_TO_UUID(`id`) AS `id`, `title`, `year`, `director`, `duration`, `poster`, `rate` FROM movies WHERE `id` = UUID_TO_BIN(?);';

    const [resultMovie] = await connection.query(selectQuery, [id]);
    const movieUpdated = resultMovie[0];
    return movieUpdated;
  }

  static async delete({ id }) {
    try {
      await connection.query(
        'DELETE FROM movies WHERE `id` = UUID_TO_BIN(?);',
        [id]
      );
    } catch (error) {
      return null;
    }
  }
}
