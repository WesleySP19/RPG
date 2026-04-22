package com.rpg.backend.dto;

import com.rpg.backend.models.UserEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-22T12:55:52-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponseDTO toDto(UserEntity user) {
        if ( user == null ) {
            return null;
        }

        UserResponseDTO userResponseDTO = new UserResponseDTO();

        userResponseDTO.setCreatedAt( user.getCreatedAt() );
        userResponseDTO.setId( user.getId() );
        userResponseDTO.setIdentifier( user.getIdentifier() );
        userResponseDTO.setLastLogin( user.getLastLogin() );
        userResponseDTO.setUserTag( user.getUserTag() );

        return userResponseDTO;
    }
}
