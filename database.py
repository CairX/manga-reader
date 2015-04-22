import sqlite3


class Database(object):

    def __init__(self, database):
        self.database = database

    def __dict_factory(self, cursor, row):
        result = {}
        for index, column in enumerate(cursor.description):
            result[column[0]] = row[index]
        return result

    def fetchone(self, query, *parameters):
        result = None

        with sqlite3.connect(self.database) as connection:
            connection.row_factory = self.__dict_factory
            cursor = connection.cursor()
            cursor.execute(query, parameters)
            result = cursor.fetchone()

        return result

    def fetchall(self, query, *parameters):
        result = None

        with sqlite3.connect(self.database) as connection:
            connection.row_factory = self.__dict_factory
            cursor = connection.cursor()
            cursor.execute(query, parameters)
            result = cursor.fetchall()

        return result

    def execute(self, query, parameters=None):
        with sqlite3.connect(self.database) as connection:
            cursor = connection.cursor()
            if parameters:
                print(parameters)
                cursor.executemany(query, parameters)
            else:
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

    select_reading = "SELECT * FROM reading"

    database = Database("data/reader.db")
    database.execute(create_reading)
    # database.execute(insert_reading)
    print(database.fetchall(select_reading))
