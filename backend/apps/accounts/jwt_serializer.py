# This serializer customizes the JWT generated when a user logs in. 
# By default, Simple JWT only includes standard claims like the user ID and token expiration. 
# Your code adds the user's email and role to the token.

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): # inheriting from default serializer

    @classmethod  # it means this method belong to class itself , not object 
    def get_token(cls, user):

        token = super().get_token(user)

        # we are adding email and role inside the jwt token 
        token["email"] = user.email
        token["role"] = user.role

        return token
    