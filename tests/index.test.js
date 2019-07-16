
const request = require('supertest');
const mockingoose = require('mockingoose').default;
const model = require("../models/users.model")
const sinon = require("sinon")
const moxios = require('moxios');
let app
describe('Test the root path', () => {

    beforeEach(function () {
        auth = require('../middleware/users.middleware');
        sinon.stub(auth, 'getUser')
            .callsFake(function (req, res, next) {
                req.user = {
                    _id: 1234
                }
                return next();
            });

        // after you can create app:
        app = require('../app')
        moxios.install();
    });

    afterEach(function () {
        // restore original method
        auth.getUser.restore();
        moxios.uninstall();
       
    });


    test('get user', (done) => {
        request(app).get('/users').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('create user expect 201', (done) => {
        const _doc = {
            username: 'username',
            password: 'password',
            name: 'name',
            surname: 'surname',
            date_of_birth: '1986-11-19',
        };

        mockingoose(model).toReturn(_doc, 'create');
        mockingoose(model).toReturn([], 'find');

        request(app).post('/users').send(_doc).then((response) => {
            expect(response.statusCode).toBe(201);
            done();
        });

    });

    test('delete user expect 202', (done) => {

        mockingoose(model).toReturn([], 'findByIdAndRemove');

        request(app).delete('/users').then((response) => {
            expect(response.statusCode).toBe(202);
            done();
        });

    });

    test('user order expect 200', (done) => {

        moxios.stubRequest("https://scb-test-book-publisher.herokuapp.com/books", {
            status: 200,
            response:  [{
                author_name: "Kristin Hannah",
                id: 4,
                book_name: "The Great Alone: A Novel Kristin Hannah",
                price: 495
            }]
          });

       
        request(app).post('/users/orders').send({orders: [4]}).then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });

    });

    test('get books expect 200', (done) => {

        moxios.stubRequest("https://scb-test-book-publisher.herokuapp.com/books", {
            status: 200,
            response:  [{
                author_name: "Kristin Hannah",
                id: 4,
                book_name: "The Great Alone: A Novel Kristin Hannah",
                price: 495
            }]
          });

          moxios.stubRequest("https://scb-test-book-publisher.herokuapp.com/books/recommendation", {
            status: 200,
            response:  [{
                author_name: "Kristin Hannah",
                id: 4,
                book_name: "The Great Alone: A Novel Kristin Hannah",
                price: 495
            }]
          });

       
        request(app).get('/books').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });

    });
});