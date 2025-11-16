import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/modules/users/dto/update-user.dto';

export class TestDataHelper {
   static createValidUser(): CreateUserDto {
      const timestamp = Date.now();
      return {
         email: `test${timestamp}@example.com`,
         password: 'ValidPassword123',
      };
   }

   static createInvalidUser(): Partial<CreateUserDto> {
      return {
         email: 'invalid-email',
         password: '123',
      };
   }

   static createUpdateUserDto(): UpdateUserDto {
      return {
         email: `updated${Date.now()}@example.com`,
         password: 'UpdatedPassword456',
      };
   }

   static createPartialUpdateUserDto(): UpdateUserDto {
      return {
         email: `partial${Date.now()}@example.com`,
      };
   }

   static createValidFeed(userId: string): { name: string; url: string; userId: string } {
      const timestamp = Date.now();
      return {
         name: `Test Feed ${timestamp}`,
         url: `https://example${timestamp}.com/rss`,
         userId,
      };
   }

   static createMultipleUsers(count: number): CreateUserDto[] {
      return Array.from({ length: count }, (_, i) => ({
         email: `user${i}_${Date.now()}@example.com`,
         password: `Password${i}123`,
      }));
   }

   static generateTestToken(userId: string): string {
      return `test-token-${userId}`;
   }

   static readonly passwords = {
      valid: 'ValidPassword123',
      tooShort: '123',
      tooLong: 'a'.repeat(256),
      withSpaces: 'Password With Spaces',
      withSpecialChars: 'P@ssw0rd!#$%',
   };

   static readonly emails = {
      valid: 'valid@example.com',
      invalid: 'invalid-email',
      withSpecialChars: 'user+test@example.com',
      duplicate: 'duplicate@example.com',
   };
}
