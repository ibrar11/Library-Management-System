'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('students', [{
        uuid: 'f82c086c-7722-4a26-9ce1-bb25b2326860',
        studentName: 'Ibrar Munawar',
        email: 'ibrarmunawar0@gmail.com',
        password: '$2b$10$gfd9Julnj3h7V9NMwqB74.zK6xLjiV3wAm342dGP7D4cTILO/oq/e',
        role: 4636,
        createdAt: '2024-01-01 11:43:14.059+05',
        updatedAt: '2024-01-01 11:43:14.059+05'
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
