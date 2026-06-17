import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CheckHash {
    public static void main(String[] args) {
        String[] pwds = {"123456", "admin", "password", "123", "root", "1234", "12345678", "qwerty", "admin123", "12345", "123456789"};
        String hash = "$2a$10$Rj5rCmbzwgEihnUBcr1A7uOMFu/Jm9iLn8c7GaXZBQGEqz3O9MwMS";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        for (String p : pwds) {
            if (encoder.matches(p, hash)) {
                System.out.println("MATCH FOUND: " + p);
                return;
            }
        }
        System.out.println("No match found.");
    }
}
