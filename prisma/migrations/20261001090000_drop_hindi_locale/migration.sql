-- The Hindi (Devanagari) interface locale was removed; move those readers to Hinglish content.
UPDATE "Profile" SET "locale" = 'hinglish' WHERE "locale" = 'hi';
