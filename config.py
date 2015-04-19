class Config(object):

    def __init__(self, default, user):
        self.items = {}
        self.__parse(default)
        self.__parse(user)

    def __parse(self, path):
        with open(path, encoding="UTF-8") as file:
            for line in file:
                try:
                    seperator = line.find("=")
                    key = line[:seperator].strip()
                    value = line[seperator + 1:].strip()

                    self.items[key] = value
                except ValueError:
                    continue

    def string(self, key):
        try:
            return self.items[key]
        except:
            raise

    def int(self, key):
        try:
            return int(self.items[key])
        except:
            raise

    def boolean(self, key):
        try:
            return self.items[key].lower() in ["true", "yes", "1"]
        except:
            raise
