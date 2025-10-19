-- Examples
-- Default profile images
INSERT INTO profile_images (name, image_url, price, is_default)
VALUES
('Default Profile', 'assets/images/profiles/defualt.png', 0, TRUE),
('Cool Profile', 'assets/images/profiles/cool.png', 100.FALSE);

-- Default avatar borders
INSERT INTO avatar_images (name, image_url, price, is_default)
VALUES
('Default Border', 'assets/images/avatar/default.png', 0, TRUE),
('Golden Frame', 'assets/images/avatar/gold.png', 500, FALSE);

-- Default backgrounds
INSERT INTO background_images (name, image_url, price, is_default)
VALUES
('Default Background', 'assets/images/backgrounds/default.png', 0, TRUE),
('Sky Theme', 'assets/images,backgrounds/sky.png', 300, FALSE);

-- countries
INSERT INTO country (
    name, code, capital, region, currency, flag_url, map_url, description, popular_places, similar_flags
)
VALUES
(
    'Afghanistan',
    'AF',
    'Kabul',
    'Asia',
    'Afghani (AFN)',
    'assets/images/flags/Afghanistan.jpg',
    'assets/images/maps/Afghanistan.jpg',
    'Afghanistan is a country surrounded by several nations and occupying a large area in South-Central Asia.',
    '{}',
    '{2,3,4,5,6}'
)