import { IsString, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateFeedDto {
   @IsUrl()
   @IsNotEmpty()
   url: string;

   @IsString()
   @IsOptional()
   title?: string;
}
