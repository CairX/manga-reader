import sqlite3


class Database(object):

    def __init__(self, database):
        self.database = database

    def __dict_factory(self, cursor, row):
        result = {}
        for index, column in enumerate(cursor.description):
            result[column[0]] = row[index]
        return result

    def fetchone(self, query):
        result = None

        with sqlite3.connect(self.database) as connection:
            connection.row_factory = self.__dict_factory
            cursor = connection.cursor()
            cursor.execute(query)
            result = cursor.fetchone()

        return result

    def fetchall(self, query):
        result = None

        with sqlite3.connect(self.database) as connection:
            connection.row_factory = self.__dict_factory
            cursor = connection.cursor()
            cursor.execute(query)
            result = cursor.fetchall()

        return result

    def execute(self, query):
        with sqlite3.connect(self.database) as connection:
            cursor = connection.cursor()
            cursor.execute(query)
            connection.commit()


if __name__ == "__main__":
    create_reading = """
        CREATE TABLE IF NOT EXISTS reading
        (
            title TEXT PRIMARY KEY,
            chapter TEXT,
            page TEXT
        );
    """

    insert_reading = """
        INSERT INTO reading(title, chapter, page)
        VALUES('onepunch-man', '0056', '09.jpg');
    """

    select_reading = "SELECT * FROM reading WHERE title = 'onepunch-man'"

    database = Database("data/test.db")
    database.execute(create_reading)
    # database.execute(insert_reading)
    print(database.fetchone(select_reading))
