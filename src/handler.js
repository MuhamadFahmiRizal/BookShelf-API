/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    };
    return h.response(response).code(400);
  }

  if (readPage > pageCount) {
    const response = {
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    };
    return h.response(response).code(400);
  }

  books.push(newBook);

  const isChecked = books.filter((book) => book.id === id).length > 0;

  if (isChecked) {
    const response = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    };
    return h.response(response).code(201);
  }

  const response = {
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  };
  return h.response(response).code(500);
};

const getAllBooks = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  let booksFilter = [...books];

  if (name) {
    const queryName = name.toLowerCase();
    booksFilter = booksFilter.filter((book) => book.name.toLowerCase().includes(queryName));
  }

  if (reading !== undefined) {
    const queryReading = reading === '1';
    booksFilter = booksFilter.filter((book) => book.reading === queryReading);
  }

  if (finished !== undefined) {
    const queryFinished = finished === '1';
    booksFilter = booksFilter.filter((book) => book.finished === queryFinished);
  }

  const booksSorter = booksFilter.map(({ id, name, publisher }) => ({ id, name, publisher }));

  const response = {
    status: 'success',
    data: {
      books: booksSorter,
    },
  };

  return h.response(response).code(200);
};

const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((b) => b.id === bookId);

  if (book) {
    const response = {
      status: 'success',
      data: {
        book,
      },
    };
    return h.response(response).code(200);
  }

  const response = {
    status: 'fail',
    message: 'Buku tidak ditemukan',
  };
  return h.response(response).code(404);
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = {
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    };
    return h.response(response).code(400);
  }

  if (readPage > pageCount) {
    const response = {
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    };
    return h.response(response).code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
    return h.response(response).code(200);
  }

  const response = {
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  };
  return h.response(response).code(404);
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
    return h.response(response).code(200);
  }

  const response = {
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  };
  return h.response(response).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
