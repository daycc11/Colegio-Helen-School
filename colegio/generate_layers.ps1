$models = @("Curso", "DiaSemana", "Estado", "Matricula", "Horario")
$types = @{
  "Curso" = "Integer";
  "DiaSemana" = "Integer";
  "Estado" = "Integer";
  "Matricula" = "Long";
  "Horario" = "Long"
}

foreach ($m in $models) {
  $idType = $types[$m]
  $repo = "package com.cibertec.colegio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cibertec.colegio.model.$m;

@Repository
public interface ${m}Repository extends JpaRepository<$m, $idType> {
}
"
  Set-Content -Path "src\main\java\com\cibertec\colegio\repository\${m}Repository.java" -Value $repo -Encoding UTF8

  $mLower = $m.Substring(0,1).ToLower() + $m.Substring(1)
  $svc = "package com.cibertec.colegio.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cibertec.colegio.model.$m;
import com.cibertec.colegio.repository.${m}Repository;

@Service
public class ${m}Service {
    @Autowired
    private ${m}Repository repository;

    public List<$m> listarTodos() { return repository.findAll(); }
    public $m guardar($m entity) { return repository.save(entity); }
    public void eliminar($idType id) { repository.deleteById(id); }
}
"
  Set-Content -Path "src\main\java\com\cibertec\colegio\service\${m}Service.java" -Value $svc -Encoding UTF8

  $ctrl = "package com.cibertec.colegio.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.cibertec.colegio.model.$m;
import com.cibertec.colegio.service.${m}Service;

@CrossOrigin(origins = ""*"")
@RestController
@RequestMapping(""/api/$mLower"")
public class ${m}RestController {
    @Autowired
    private ${m}Service service;

    @GetMapping
    public List<$m> listar() { return service.listarTodos(); }

    @PostMapping
    public $m guardar(@RequestBody $m entity) { return service.guardar(entity); }

    @DeleteMapping(""/{id}"")
    public void eliminar(@PathVariable $idType id) { service.eliminar(id); }
}
"
  Set-Content -Path "src\main\java\com\cibertec\colegio\controller\${m}RestController.java" -Value $ctrl -Encoding UTF8
}
