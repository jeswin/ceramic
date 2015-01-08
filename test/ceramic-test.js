var co = require('co');
var assert = require('assert');

describe("Ceramic Core", function() {
    var Author, BlogPost;
    var authorSchema, postSchema;
    var Ceramic;

    before(function() {
        return co(function*() {
            Ceramic = require("../lib/ceramic");

            Author = function(params) {
                if (params) {
                    for(var key in params) {
                        this[key] = params[key];
                    }
                }
            };

            authorSchema = {
                name: 'author',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        location: { type: 'string' },
                        age: { type: 'number' }
                    },
                    required: ['name', 'location']
                }
            };

            authorSchema.ctor = Author;

            BlogPost = function(params) {
                if (params) {
                    for(var key in params) {
                        this[key] = params[key];
                    }
                }
            };

            postSchema = {
                name: 'post',
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        content: { type: 'string' },
                        published: { type: 'string' },
                        author: { $ref: 'author' }
                    },
                    required: ['title', 'content', 'author']
                }
            };

            postSchema.ctor = BlogPost;

        });
    });


    it("completeEntitySchema must complete the entitySchema", function() {
        return co(function*() {
            var songSchema = {
                name: 'ticket',
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        artist: { type: 'string' },
                        price: { type: 'number' }
                    },
                    required: ['title', 'artist']
                }
            };

            var ceramic = new Ceramic();
            var entitySchema = yield* ceramic.completeEntitySchema(songSchema);
            assert.notEqual(entitySchema, null);
            assert.equal(entitySchema.schema.required.length, 2);
        });
    });


    it("completeVirtualEntitySchema must complete the virtualEntitySchema", function() {
        return co(function*() {
            var songSchema = {
                name: 'ticket',
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        artist: { type: 'string' },
                        price: { type: 'number' }
                    },
                    required: ['title', 'artist']
                }
            };

            var mp3Schema = {
                schema: {
                    properties: {
                        bitrate: { type: 'number' }
                    },
                    required: ['bitrate']
                }
            };

            var ceramic = new Ceramic();
            var entitySchema = yield* ceramic.completeVirtualEntitySchema(mp3Schema, songSchema);
            assert.equal(entitySchema.schema.required.length, 3);
        });
    });


    it("init must create a schema cache", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var schemaCache = yield* ceramic.init([authorSchema, postSchema]);
            assert.equal(Object.keys(schemaCache).length, 2);
        });
    });


    it("constructEntity must create a construct a model", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var schemaCache = yield* ceramic.init([authorSchema, postSchema]);
            var blogPostJSON = {
                title: "Busy Being Born",
                content: "The days keep dragging on, Those rats keep pushing on,  The slowest race around, We all just race around ...",
                published: "yes",
                author: {
                    name: "Middle Class Rut",
                    location: "USA",
                }
            };
            var blogPost = yield* ceramic.constructEntity(blogPostJSON, postSchema);
            assert.equal(blogPost instanceof BlogPost, true, "blogPost must be an instanceof BlogPost");
            assert.equal(blogPost.author instanceof Author, true, "blogPost must be an instanceof Author");
        });
    });



    it("updateEntity must create a schema cache", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    it("validate must compare entity against an entitySchema", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    after(function() {
        return co(function*() {
            var a = 1;
        });
    });
});
