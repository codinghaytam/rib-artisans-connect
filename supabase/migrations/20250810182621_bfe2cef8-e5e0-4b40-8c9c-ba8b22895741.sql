-- Add some realistic addresses to existing artisan profiles for map display
UPDATE artisan_profiles 
SET address = CASE 
  WHEN cities.name = 'Casablanca' THEN 'Boulevard Mohammed V, Casablanca'
  WHEN cities.name = 'Rabat' THEN 'Avenue Hassan II, Rabat'  
  WHEN cities.name = 'Marrakech' THEN 'Place Jemaa el-Fnaa, Marrakech'
  WHEN cities.name = 'Fès' THEN 'Médina de Fès, Fès'
  WHEN cities.name = 'Tangier' THEN 'Boulevard Pasteur, Tangier'
  WHEN cities.name = 'Agadir' THEN 'Avenue du Prince Sidi Mohamed, Agadir'
  WHEN cities.name = 'Meknès' THEN 'Place El Hedim, Meknès'
  WHEN cities.name = 'Oujda' THEN 'Boulevard Mohammed Derfoufi, Oujda'
  WHEN cities.name = 'Kenitra' THEN 'Avenue Mohammed VI, Kenitra'
  WHEN cities.name = 'Tétouan' THEN 'Place Hassan II, Tétouan'
  ELSE CONCAT(cities.name, ', Morocco')
END
FROM cities 
WHERE artisan_profiles.city_id = cities.id 
AND artisan_profiles.address IS NULL;