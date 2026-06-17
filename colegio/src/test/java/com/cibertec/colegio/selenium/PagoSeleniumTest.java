package com.cibertec.colegio.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * Pruebas UI con Selenium WebDriver — Módulo de Pagos
 * Helen School
 *
 * REQUISITOS:
 *  - Backend  corriendo en http://localhost:8080
 *  - Frontend corriendo en http://localhost:4200
 *  - Google Chrome instalado
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Pruebas UI Selenium — Módulo de Pagos")
public class PagoSeleniumTest {

    private static WebDriver driver;
    private static WebDriverWait wait;
    private static JavascriptExecutor js;

    private static final String BASE_URL = "http://localhost:4200";
    private static final String USUARIO  = "mrodriguez";
    private static final String CLAVE    = "123456";

    @BeforeAll
    static void configurarDriver() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        driver = new ChromeDriver(options);
        wait   = new WebDriverWait(driver, Duration.ofSeconds(20));
        js     = (JavascriptExecutor) driver;
    }

    @AfterAll
    static void cerrarDriver() throws InterruptedException {
        Thread.sleep(3000);
        if (driver != null) driver.quit();
    }

    // ── Helpers ───────────────────────────────────
    private void pausa(int ms) throws InterruptedException { Thread.sleep(ms); }
    private void pausa()       throws InterruptedException { pausa(1200); }

    /** Espera hasta que el elemento sea clickeable */
    private WebElement esperar(By by) {
        return wait.until(ExpectedConditions.elementToBeClickable(by));
    }

    /** Espera hasta que el elemento sea visible */
    private WebElement esperarVisible(By by) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(by));
    }

    /** Click vía JavaScript (evita problemas de Angular Change Detection) */
    private void jsClick(WebElement el) {
        js.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
        js.executeScript("arguments[0].click();", el);
    }

    /** Escribe en un input limpiándolo antes */
    private void escribir(WebElement el, String texto) throws InterruptedException {
        js.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
        el.clear();
        el.sendKeys(texto);
        pausa(500);
    }

    // ─────────────────────────────────────────────
    //  TEST 1 — Login
    // ─────────────────────────────────────────────
    @Test
    @Order(1)
    @DisplayName("1 - Login con credenciales validas")
    void test01_login() throws InterruptedException {
        driver.get(BASE_URL + "/login");
        pausa(1500);

        // Campo usuario
        WebElement usuario = esperar(By.cssSelector("input[type='text'], input[name='username']"));
        escribir(usuario, USUARIO);

        // Campo contraseña
        WebElement clave = esperar(By.cssSelector("input[type='password']"));
        escribir(clave, CLAVE);

        // Botón ingresar
        WebElement btnLogin = esperar(By.cssSelector("button[type='submit']"));
        jsClick(btnLogin);
        pausa(2500);

        wait.until(ExpectedConditions.urlContains("/dashboard"));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/dashboard"),
                "No redirecciono al dashboard");
        System.out.println("TEST 1 PASO: Login exitoso -> " + driver.getCurrentUrl());
    }

    // ─────────────────────────────────────────────
    //  TEST 2 — Navegar a Pagos
    // ─────────────────────────────────────────────
    @Test
    @Order(2)
    @DisplayName("2 - Navegar al modulo de Pagos desde el sidebar")
    void test02_navegarAPagos() throws InterruptedException {
        // Buscar el link de Pagos en el sidebar
        WebElement linkPagos = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//a[contains(@routerlink,'/pagos') or contains(@href,'/pagos')]")));
        jsClick(linkPagos);
        pausa(2000);

        wait.until(ExpectedConditions.urlContains("/pagos"));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/pagos"),
                "No navego a /pagos");
        System.out.println("TEST 2 PASO: Modulo Pagos -> " + driver.getCurrentUrl());
    }

    // ─────────────────────────────────────────────
    //  TEST 3 — Vista Pendientes
    // ─────────────────────────────────────────────
    @Test
    @Order(3)
    @DisplayName("3 - La vista Pendientes carga correctamente")
    void test03_vistaPendientes() throws InterruptedException {
        pausa(1500);

        WebElement titulo = esperarVisible(By.cssSelector("h1"));
        System.out.println("TEST 3: Titulo encontrado -> " + titulo.getText());

        boolean hayTabla  = !driver.findElements(By.cssSelector(".neo-table")).isEmpty();
        boolean bannerOk  = !driver.findElements(By.cssSelector(".all-paid-banner")).isEmpty();

        Assertions.assertTrue(hayTabla || bannerOk,
                "No se encontro tabla de pendientes ni banner");

        System.out.println("TEST 3 PASO: " +
                (hayTabla ? "Tabla de pendientes visible" : "Banner 'Todos al dia' visible"));
        pausa();
    }

    // ─────────────────────────────────────────────
    //  TEST 4 — Abrir Procesar Pago
    // ─────────────────────────────────────────────
    @Test
    @Order(4)
    @DisplayName("4 - Abrir formulario Procesar Pago y seleccionar alumno")
    void test04_abrirFormularioPago() throws InterruptedException {
        // Buscar el tab "Procesar Pago"
        List<WebElement> botones = driver.findElements(By.cssSelector("button.tab-btn"));
        WebElement tabProcesar = botones.stream()
                .filter(b -> b.getText().contains("Procesar"))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Tab Procesar Pago no encontrado"));

        jsClick(tabProcesar);
        pausa(1500);

        // Seleccionar alumno del dropdown
        WebElement selectAlumno = esperar(By.cssSelector("select[name='alumno']"));
        Select sel = new Select(selectAlumno);
        Assertions.assertTrue(sel.getOptions().size() > 1, "No hay alumnos en el selector");
        sel.selectByIndex(1);
        pausa(1000);

        System.out.println("TEST 4 PASO: Formulario abierto, alumno seleccionado: "
                + sel.getFirstSelectedOption().getText());
    }

    // ─────────────────────────────────────────────
    //  TEST 5 — Seleccionar Tarjeta
    // ─────────────────────────────────────────────
    @Test
    @Order(5)
    @DisplayName("5 - Seleccionar metodo Tarjeta de Credito/Debito")
    void test05_seleccionarTarjeta() throws InterruptedException {
        List<WebElement> cards = driver.findElements(By.cssSelector(".metodo-card"));
        Assertions.assertFalse(cards.isEmpty(), "No se encontraron metodos de pago");
        jsClick(cards.get(0)); // primer card = Tarjeta
        pausa(1500);

        // Esperar que el campo de tarjeta sea visible
        WebElement inputTarjeta = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("input[placeholder*='0000'], input[name='numeroTarjeta']")));
        Assertions.assertTrue(inputTarjeta.isDisplayed(), "Formulario de tarjeta no visible");
        System.out.println("TEST 5 PASO: Formulario de Tarjeta visible");
        pausa();
    }

    // ─────────────────────────────────────────────
    //  TEST 6 — Llenar datos de tarjeta
    // ─────────────────────────────────────────────
    @Test
    @Order(6)
    @DisplayName("6 - Llenar datos de tarjeta de credito")
    void test06_llenarDatosTarjeta() throws InterruptedException {
        // Número de tarjeta
        WebElement inputNum = esperar(
                By.cssSelector("input[placeholder*='0000'], input[name='numeroTarjeta']"));
        escribir(inputNum, "4111111111111111");

        // Titular
        WebElement inputTitular = esperar(
                By.cssSelector("input[placeholder*='JUAN'], input[name='nombreTitular']"));
        escribir(inputTitular, "CARLOS RAMIREZ");

        // Vencimiento
        WebElement inputVenc = esperar(
                By.cssSelector("input[placeholder='MM/AA'], input[name='vencimiento']"));
        escribir(inputVenc, "12/26");

        // CVV
        WebElement inputCvv = esperar(
                By.cssSelector("input[placeholder='•••'], input[name='cvv']"));
        escribir(inputCvv, "123");

        System.out.println("TEST 6 PASO: Datos de tarjeta ingresados correctamente");
        pausa();
    }

    // ─────────────────────────────────────────────
    //  TEST 7 — Cambiar a Yape/Plin
    // ─────────────────────────────────────────────
    @Test
    @Order(7)
    @DisplayName("7 - Cambiar metodo de pago a Yape / Plin")
    void test07_seleccionarYape() throws InterruptedException {
        List<WebElement> cards = driver.findElements(By.cssSelector(".metodo-card"));
        Assertions.assertTrue(cards.size() >= 3, "No hay suficientes metodos de pago");
        jsClick(cards.get(2)); // tercer card = Yape/Plin
        pausa(1500);

        // Verificar que aparece el QR
        WebElement qr = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".qr-placeholder")));
        Assertions.assertTrue(qr.isDisplayed(), "QR no visible en Yape/Plin");
        System.out.println("TEST 7 PASO: Metodo Yape/Plin seleccionado, QR visible");
        pausa();
    }

    // ─────────────────────────────────────────────
    //  TEST 8 — Cambiar a Transferencia
    // ─────────────────────────────────────────────
    @Test
    @Order(8)
    @DisplayName("8 - Seleccionar Transferencia Bancaria y elegir banco BCP")
    void test08_seleccionarTransferencia() throws InterruptedException {
        List<WebElement> cards = driver.findElements(By.cssSelector(".metodo-card"));
        Assertions.assertTrue(cards.size() >= 2, "No hay suficientes metodos de pago");
        jsClick(cards.get(1)); // segundo card = Transferencia
        pausa(1500);

        // Seleccionar banco
        WebElement selectBanco = esperar(By.cssSelector("select[name='banco']"));
        new Select(selectBanco).selectByVisibleText("BCP");
        pausa(700);

        // Número de operación
        WebElement inputOp = esperar(By.cssSelector("input[name='numeroOperacion']"));
        escribir(inputOp, "0099887766");

        System.out.println("TEST 8 PASO: Transferencia seleccionada, banco: BCP");
        pausa();
    }

    // ─────────────────────────────────────────────
    //  TEST 9 — Ver Historial
    // ─────────────────────────────────────────────
    @Test
    @Order(9)
    @DisplayName("9 - Navegar al Historial de pagos")
    void test09_verHistorial() throws InterruptedException {
        // Buscar botón Historial entre todos los tab-btn
        List<WebElement> tabs = driver.findElements(By.cssSelector("button.tab-btn"));
        WebElement tabHistorial = tabs.stream()
                .filter(b -> b.getText().contains("Historial"))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Tab Historial no encontrado"));

        jsClick(tabHistorial);
        pausa(2000);

        WebElement tabla = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".neo-table")));
        Assertions.assertTrue(tabla.isDisplayed(), "Tabla de historial no visible");

        List<WebElement> filas = driver.findElements(By.cssSelector(".neo-table tbody tr"));
        System.out.println("TEST 9 PASO: Historial visible, filas encontradas: " + filas.size());
        pausa();
    }

    // ─────────────────────────────────────────────
    //  TEST 10 — Cerrar sesión
    // ─────────────────────────────────────────────
    @Test
    @Order(10)
    @DisplayName("10 - Cerrar sesion correctamente")
    void test10_cerrarSesion() throws InterruptedException {
        // El botón logout está en el sidebar
        WebElement btnLogout = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".btn-logout")));
        jsClick(btnLogout);
        pausa(2500);

        wait.until(ExpectedConditions.urlContains("/login"));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/login"),
                "No redirigió al login");
        System.out.println("TEST 10 PASO: Sesion cerrada -> " + driver.getCurrentUrl());
        pausa(2000);
    }
}
